use async_trait::async_trait;

#[async_trait]
pub trait TraitDevice {
    async fn get_wattage(&self) -> f64;
    async fn sync_onchain_wattage(&self) -> f64;
    async fn generate_wallet(&self) -> String;
}

#[derive(Debug, Clone, PartialEq)]
pub struct Device {
    pub unique_id: String,
    pub name: String,
    pub wallet: String,
    pub wattage: f64,
}

impl Device {
    pub fn new(unique_id: String, name: String, wallet: String, wattage: f64) -> Self {
        Self {
            unique_id,
            name,
            wallet,
            wattage,
        }
    }
}

#[async_trait]
impl TraitDevice for Device {
    async fn get_wattage(&self) -> f64 {
        self.wattage
    }

    async fn sync_onchain_wattage(&self) -> f64 {
        // Mock: simulate a small variance based on unique_id bytes
        let hash: f64 = self
            .unique_id
            .bytes()
            .fold(0u32, |acc, b| acc.wrapping_mul(31).wrapping_add(b as u32))
            as f64;
        let variance = ((hash % 100.0) - 50.0) / 100.0; // range: -0.50 .. +0.49
        (self.wattage + variance).max(0.0)
    }

    async fn generate_wallet(&self) -> String {
        // Mock: generate a fake Solana base58-style address (44 chars)
        let base58_chars: &[u8] = b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let seed = self.unique_id.bytes().chain(self.name.bytes());
        let mut result = String::with_capacity(44);
        let mut state: u32 = 0;
        for b in seed {
            state = state.wrapping_mul(31).wrapping_add(b as u32);
        }
        for i in 0..44 {
            state = state.wrapping_mul(31).wrapping_add(i as u32);
            let idx = (state as usize) % base58_chars.len();
            result.push(base58_chars[idx] as char);
        }
        result
    }
}
