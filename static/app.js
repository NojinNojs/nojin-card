(() => {
	window.addEventListener('keydown', (event) => {
		if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.repeat || event.defaultPrevented || event.isComposing) return;
		if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
		if (!/^[1-4]$/.test(event.key)) return;
		const link = document.querySelector(`a[data-key="${event.key}"]`);
		if (link) { event.preventDefault(); window.open(link.href, '_blank', 'noopener'); }
	});

	const art = document.querySelector('.art');
	const pointer = matchMedia('(hover:hover) and (pointer:fine)');
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	let frame = 0, x = 0, y = 0;
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(() => {
			art.style.setProperty('--pointer-x', `${x}px`);
			art.style.setProperty('--pointer-y', `${y}px`);
			frame = 0;
		});
	};
	const move = (event) => {
		if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
		const dx = (event.clientX / innerWidth - 0.5) * 2;
		const dy = (event.clientY / innerHeight - 0.5) * 2;
		const distance = Math.max(1, Math.hypot(dx, dy));
		x = dx / distance * 8; y = dy / distance * 8; schedule();
	};
	const reset = () => { x = y = 0; schedule(); };
	const sync = () => {
		cancelAnimationFrame(frame); frame = 0;
		window.removeEventListener('pointermove', move);
		document.documentElement.removeEventListener('pointerleave', reset);
		window.removeEventListener('blur', reset);
		art.style.removeProperty('--pointer-x'); art.style.removeProperty('--pointer-y');
		if (!pointer.matches || reduced.matches) return;
		window.addEventListener('pointermove', move, { passive: true });
		document.documentElement.addEventListener('pointerleave', reset);
		window.addEventListener('blur', reset);
	};
	pointer.addEventListener('change', sync);
	reduced.addEventListener('change', sync);
	sync();
})();
