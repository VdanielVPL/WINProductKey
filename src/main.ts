import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { writeText } from "@tauri-apps/api/clipboard";

async function getKey(span: HTMLSpanElement | null) {
	let key = await invoke("get_product_key").then((message)=>{
		return message as string
	});
	if (span){
		span.innerText = key
	}
}

function toast(){
	const toast = document.getElementById('toast');
	if (toast) {
		toast.style.opacity = '1';
		setTimeout(function () {
			toast.style.opacity = '0';
		}, 1500);
	}
}

function copyKey(){
	const span = document.getElementById('span');
	if (span){
		writeText(span.innerText).then(() => {
			toast();
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	let container = document.getElementById('container')
	let keybox = document.getElementById('keybox')
	if(container){
		container.style.opacity = '1'
		let span = document.getElementById("span");
		getKey(span)
		appWindow.listen('tauri://blur', () => {
			container.style.opacity = '0'
			setTimeout(() => {
				appWindow.close();
			}, 400);
		});
	}
	if(keybox){
		keybox.onclick = copyKey;
	}
});

document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});