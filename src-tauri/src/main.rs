// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use winreg::{enums::{RegType::REG_BINARY, HKEY_LOCAL_MACHINE}, RegKey};

fn convert_to_key(key: Vec<u8>) -> String{
    const CHARS: &str = "BCDFGHJKMPQRTVWXY2346789";
    const KEY_OFFSET: usize = 52;
    let mut key_output = String::new();
    let mut key_array = key[KEY_OFFSET..KEY_OFFSET + 15].to_vec();
    
    for _ in 0..25 {
        let mut cur: u32 = 0;
        for j in (0..15).rev() {
            cur = cur * 256 + key_array[j] as u32;
            key_array[j] = (cur / 24) as u8;
            cur %= 24;
        }
        key_output = CHARS.chars().nth(cur as usize).unwrap().to_string() + &key_output;
    }
    
    for i in (5..key_output.len()).step_by(5).rev() {
        key_output.insert(i, '-');
    }
    
    key_output
}

fn get_key() -> io::Result<String>{
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    let cur_ver = hklm.open_subkey("SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion")?;
    let raw_product_key  = cur_ver.get_raw_value("DigitalProductId")?;

    if raw_product_key.vtype == REG_BINARY {
        // let data = raw_product_key.to_string();
        let data = raw_product_key.bytes;
        let key = convert_to_key(data);
        Ok(key)
    }else{
        Err(io::Error::new(io::ErrorKind::Other, "Error"))
    }
}

#[tauri::command]
fn get_product_key() -> Result<String, String> {
    get_key().map_err(|e| format!("Error: {}", e))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_product_key])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}