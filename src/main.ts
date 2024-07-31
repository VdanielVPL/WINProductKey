import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from '@tauri-apps/api/event';

async function getKey(span: HTMLSpanElement | null) {
	let key = await invoke("get_product_key").then((message)=>{
		console.log(message)
		return message as string
	});
	if (span){
		span.innerText = key
	}
}

window.addEventListener("DOMContentLoaded", () => {
	let span = document.getElementById("span");
	getKey(span)
	listen('tauri://blur', () => {
		appWindow.close();
	});
});
document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});
