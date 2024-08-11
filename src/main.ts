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
	let container = document.getElementById('container')
	if(container){
		container.style.opacity = '1'
		let span = document.getElementById("span");
		getKey(span)
		listen('tauri://blur', () => {
			container.style.opacity = '0'
			setTimeout(() => {
				appWindow.close();
			}, 400);
		});
	}
});

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});