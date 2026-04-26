use clap::{Parser, Subcommand};
use solana_sdk::signer::Signer;
use solarcell::rpc::{self, fetch_device_account, send_record_energy, send_register_device};

const DEFAULT_RPC_URL: &str = "http://127.0.0.1:8899";
const DEFAULT_KEYPAIR_PATH: &str = "~/.config/solana/id.json";
const PROGRAM_ID: &str = "36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY";
const DEFAULT_INTERVAL_SECS: u64 = 5;

#[derive(Parser)]
#[command(name = "solarcell-cli", version, about = "Mock solar device CLI for greenmove")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(long, default_value = DEFAULT_RPC_URL)]
    rpc: String,

    #[arg(long, default_value = DEFAULT_KEYPAIR_PATH)]
    keypair: String,
}

#[derive(Subcommand)]
enum Commands {
    Register {
        #[arg(long)]
        unique_id: String,
        #[arg(long)]
        name: String,
    },
    Record {
        #[arg(long)]
        unique_id: String,
        #[arg(long)]
        wattage: u64,
        #[arg(long)]
        energy: u64,
    },
    Run {
        #[arg(long)]
        unique_id: String,
        #[arg(long, default_value_t = DEFAULT_INTERVAL_SECS)]
        interval: u64,
    },
    Info {
        #[arg(long)]
        unique_id: String,
    },
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();
    let program_id = PROGRAM_ID.parse().expect("invalid program id");
    let client = rpc::create_rpc_client(&cli.rpc);
    let keypair = rpc::load_keypair(&cli.keypair);

    match cli.command {
        Commands::Register { unique_id, name } => {
            let sig = send_register_device(&client, &keypair, &program_id, &unique_id, &name);
            println!("register tx: {sig}");
            println!("device PDA owner: {}", keypair.pubkey());
        }
        Commands::Record {
            unique_id,
            wattage,
            energy,
        } => {
            let sig = send_record_energy(&client, &keypair, &program_id, &unique_id, wattage, energy);
            println!("record tx: {sig}");
        }
        Commands::Run {
            unique_id,
            interval,
        } => {
            println!("continuous recording every {interval}s for device '{unique_id}'");
            println!("press Ctrl+C to stop");
            let mut tick: u64 = 1;
            loop {
                let wattage = 1000 + (tick % 10) * 100;
                let energy_wh = tick;
                let sig = send_record_energy(&client, &keypair, &program_id, &unique_id, wattage, energy_wh);
                println!("[{tick}] wattage={wattage}mW energy={energy_wh}Wh tx: {sig}");
                tick += 1;
                tokio::time::sleep(std::time::Duration::from_secs(interval)).await;
            }
        }
        Commands::Info { unique_id } => {
            match fetch_device_account(&client, &keypair.pubkey(), &program_id, &unique_id) {
                Some(device) => {
                    println!("unique_id:     {}", device.unique_id);
                    println!("name:          {}", device.name);
                    println!("owner:         {}", device.owner);
                    println!("total_energy:  {} Wh", device.total_energy_wh);
                    println!("wattage:       {} mW", device.current_wattage_mw);
                    println!("records:       {}", device.record_count);
                    println!("active:        {}", device.active);
                    println!("registered_at: {}", device.registered_at);
                    println!("last_record:   {}", device.last_record_at);
                }
                None => println!("device not found"),
            }
        }
    }
}
