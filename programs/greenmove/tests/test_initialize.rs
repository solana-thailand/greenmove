use {
    anchor_lang::{
        solana_program::{instruction::Instruction, pubkey::Pubkey, system_program},
        InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

/// Helper: set up LiteSVM with the greenmove program loaded and a funded payer.
fn setup_svm() -> (LiteSVM, Keypair) {
    let program_id = greenmove::id();
    let payer = Keypair::new();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/greenmove.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
    (svm, payer)
}

/// Helper: send a single instruction, return true on success.
fn send_ix(svm: &mut LiteSVM, payer: &Keypair, ix: Instruction) -> bool {
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();
    let res = svm.send_transaction(tx);
    if let Err(ref e) = res {
        eprintln!("send_ix error: {:?}", e);
    }
    res.is_ok()
}

/// Helper: derive the SolarDevice PDA.
fn find_device_pda(owner: &Pubkey, unique_id: &str) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            greenmove::SOLAR_DEVICE_SEED.as_bytes(),
            owner.as_ref(),
            unique_id.as_bytes(),
        ],
        &greenmove::id(),
    )
}

/// Helper: derive the EnergyRecord PDA.
fn find_energy_record_pda(device: &Pubkey, record_index: u64) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            greenmove::ENERGY_RECORD_SEED.as_bytes(),
            device.as_ref(),
            &record_index.to_le_bytes(),
        ],
        &greenmove::id(),
    )
}

// ---------------------------------------------------------------------------
// test_initialize
// ---------------------------------------------------------------------------

#[test]
fn test_initialize() {
    let program_id = greenmove::id();
    let payer = Keypair::new();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!("../../../target/deploy/greenmove.so");
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();

    let instruction = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::Initialize {}.data(),
        greenmove::accounts::Initialize {}.to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[instruction], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();

    let res = svm.send_transaction(tx);
    assert!(res.is_ok());
}

// ---------------------------------------------------------------------------
// test_register_device
// ---------------------------------------------------------------------------

#[test]
fn test_register_device() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-001".to_string();
    let name = "Rooftop Solar Panel".to_string();

    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    let ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RegisterDevice {
            unique_id: unique_id.clone(),
            name: name.clone(),
        }
        .data(),
        greenmove::accounts::RegisterDevice {
            owner: payer.pubkey(),
            solar_device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, ix),
        "register_device should succeed"
    );
}

// ---------------------------------------------------------------------------
// test_record_energy
// ---------------------------------------------------------------------------

#[test]
fn test_record_energy() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-002".to_string();
    let name = "Garden Solar Panel".to_string();

    // Step 1 – register the device
    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    let register_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RegisterDevice {
            unique_id: unique_id.clone(),
            name: name.clone(),
        }
        .data(),
        greenmove::accounts::RegisterDevice {
            owner: payer.pubkey(),
            solar_device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, register_ix),
        "register_device should succeed"
    );

    // Step 2 – record an energy reading
    let (energy_record_pda, _) = find_energy_record_pda(&device_pda, 0);

    let record_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RecordEnergy {
            wattage_mw: 5000, // 5 W
            energy_wh: 10,    // 10 Wh
        }
        .data(),
        greenmove::accounts::RecordEnergy {
            owner: payer.pubkey(),
            device: device_pda,
            energy_record: energy_record_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, record_ix),
        "record_energy should succeed"
    );
}

// ---------------------------------------------------------------------------
// test_update_device
// ---------------------------------------------------------------------------

#[test]
fn test_update_device() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-003".to_string();
    let name = "Balcony Solar Panel".to_string();

    // Step 1 – register
    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    let register_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RegisterDevice {
            unique_id: unique_id.clone(),
            name: name.clone(),
        }
        .data(),
        greenmove::accounts::RegisterDevice {
            owner: payer.pubkey(),
            solar_device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, register_ix),
        "register_device should succeed"
    );

    // Step 2 – update name and deactivate
    let update_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::UpdateDevice {
            params: greenmove::UpdateDeviceParams {
                new_name: Some("Updated Balcony Panel".to_string()),
                new_active: Some(false),
            },
        }
        .data(),
        greenmove::accounts::UpdateDevice {
            owner: payer.pubkey(),
            device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, update_ix),
        "update_device should succeed"
    );
}

// ---------------------------------------------------------------------------
// test_record_energy_multiple – three sequential records on the same device
// ---------------------------------------------------------------------------

#[test]
fn test_record_energy_multiple() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-004".to_string();
    let name = "Multi-Record Panel".to_string();

    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    // Register
    let register_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RegisterDevice {
            unique_id: unique_id.clone(),
            name: name.clone(),
        }
        .data(),
        greenmove::accounts::RegisterDevice {
            owner: payer.pubkey(),
            solar_device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, register_ix),
        "register_device should succeed"
    );

    // Record three energy entries
    let readings: Vec<(u64, u64)> = vec![
        (3000, 5),  // 3 W, 5 Wh
        (4500, 8),  // 4.5 W, 8 Wh
        (6000, 12), // 6 W, 12 Wh
    ];

    for (i, (wattage_mw, energy_wh)) in readings.into_iter().enumerate() {
        let (energy_record_pda, _) = find_energy_record_pda(&device_pda, i as u64);

        let record_ix = Instruction::new_with_bytes(
            program_id,
            &greenmove::instruction::RecordEnergy {
                wattage_mw,
                energy_wh,
            }
            .data(),
            greenmove::accounts::RecordEnergy {
                owner: payer.pubkey(),
                device: device_pda,
                energy_record: energy_record_pda,
                system_program: system_program::id(),
            }
            .to_account_metas(None),
        );

        assert!(
            send_ix(&mut svm, &payer, record_ix),
            "record_energy #{} should succeed",
            i
        );
    }
}

// ---------------------------------------------------------------------------
// test_register_duplicate_device_fails – same owner + unique_id twice
// ---------------------------------------------------------------------------

#[test]
fn test_register_duplicate_device_fails() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-DUP".to_string();
    let name = "Duplicate Test Panel".to_string();

    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    let make_ix = || {
        Instruction::new_with_bytes(
            program_id,
            &greenmove::instruction::RegisterDevice {
                unique_id: unique_id.clone(),
                name: name.clone(),
            }
            .data(),
            greenmove::accounts::RegisterDevice {
                owner: payer.pubkey(),
                solar_device: device_pda,
                system_program: system_program::id(),
            }
            .to_account_metas(None),
        )
    };

    // First registration – ok
    assert!(
        send_ix(&mut svm, &payer, make_ix()),
        "first register should succeed"
    );

    // Second registration – should fail (account already exists)
    assert!(
        !send_ix(&mut svm, &payer, make_ix()),
        "duplicate device registration should fail"
    );
}

// ---------------------------------------------------------------------------
// test_record_energy_inactive_device_fails
// ---------------------------------------------------------------------------

#[test]
fn test_record_energy_inactive_device_fails() {
    let program_id = greenmove::id();
    let (mut svm, payer) = setup_svm();

    let unique_id = "SOLAR-DEVICE-INACTIVE".to_string();
    let name = "Inactive Test Panel".to_string();

    // Register
    let (device_pda, _) = find_device_pda(&payer.pubkey(), &unique_id);

    let register_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RegisterDevice {
            unique_id: unique_id.clone(),
            name: name.clone(),
        }
        .data(),
        greenmove::accounts::RegisterDevice {
            owner: payer.pubkey(),
            solar_device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, register_ix),
        "register_device should succeed"
    );

    // Deactivate
    let deactivate_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::UpdateDevice {
            params: greenmove::UpdateDeviceParams {
                new_name: None,
                new_active: Some(false),
            },
        }
        .data(),
        greenmove::accounts::UpdateDevice {
            owner: payer.pubkey(),
            device: device_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        send_ix(&mut svm, &payer, deactivate_ix),
        "update_device (deactivate) should succeed"
    );

    // Attempt to record energy on inactive device – should fail
    let (energy_record_pda, _) = find_energy_record_pda(&device_pda, 0);

    let record_ix = Instruction::new_with_bytes(
        program_id,
        &greenmove::instruction::RecordEnergy {
            wattage_mw: 5000,
            energy_wh: 10,
        }
        .data(),
        greenmove::accounts::RecordEnergy {
            owner: payer.pubkey(),
            device: device_pda,
            energy_record: energy_record_pda,
            system_program: system_program::id(),
        }
        .to_account_metas(None),
    );

    assert!(
        !send_ix(&mut svm, &payer, record_ix),
        "record_energy on inactive device should fail"
    );
}
