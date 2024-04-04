#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_stronghold::Builder::new(|password| {
            // Hash the password here with e.g. argon2, blake2b or any other secure algorithm
            // Here is an example implementation using the `rust-argon2` crate for hashing the password
            use argon2::{hash_raw, Config, Variant, Version};

            let config = Config {
                lanes: 4,
                mem_cost: 10_000,
                time_cost: 10,
                variant: Variant::Argon2id,
                version: Version::Version13,
                ..Default::default()
            };
            let salt = "glksdnvkjdoirjelkcmsl".as_bytes();
            let key =
                hash_raw(password.as_ref(), salt, &config).expect("failed to hash password");

            key.to_vec()
        }).build())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
