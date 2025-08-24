// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const observer = new IntersectionObserver((entries)=>{
	entries.forEach((entry)=>{
		if(entry.isIntersecting){
			entry.target.classList.add('visible');
			observer.unobserve(entry.target);
		}
	});
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Parallax for hero visual
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');
let parallaxEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
hero?.addEventListener('mousemove', (e)=>{
	if(!heroVisual || !parallaxEnabled) return;
	const rect = hero.getBoundingClientRect();
	const rx = (e.clientX - rect.left) / rect.width - .5;
	const ry = (e.clientY - rect.top) / rect.height - .5;
	heroVisual.style.transform = `translate3d(${rx*10}px, ${ry*10}px, 0)`;
});

// Canvas particles background
(function(){
	const canvas = document.getElementById('particles');
	if(!canvas) return;
	const ctx = canvas.getContext('2d');
	let w, h, dpr;
	let particles = [];
	const NUM = 80;
	function resize(){
		dpr = window.devicePixelRatio || 1;
		w = canvas.width = innerWidth * dpr;
		h = canvas.height = innerHeight * dpr;
		canvas.style.width = innerWidth + 'px';
		canvas.style.height = innerHeight + 'px';
	}
	window.addEventListener('resize', resize);
	resize();
	for(let i=0;i<NUM;i++){
		particles.push({
			x: Math.random()*w,
			y: Math.random()*h,
			r: (Math.random()*1.8+0.4)*dpr,
			xv: (Math.random()-.5)*0.12*dpr,
			yv: (Math.random()-.5)*0.12*dpr,
			alpha: Math.random()*0.6+0.2
		});
	}
	let raf;
	function step(){
		ctx.clearRect(0,0,w,h);
		for(const p of particles){
			p.x += p.xv; p.y += p.yv;
			if(p.x<0||p.x>w) p.xv*=-1;
			if(p.y<0||p.y>h) p.yv*=-1;
			ctx.beginPath();
			ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
			ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
			ctx.fill();
		}
		raf = requestAnimationFrame(step);
	}
	const mq = matchMedia('(prefers-reduced-motion: reduce)');
	function applyMotionPref(){
		if(mq.matches){
			cancelAnimationFrame(raf);
			ctx.clearRect(0,0,w,h);
			return;
		}
		step();
	}
	mq.addEventListener?.('change', applyMotionPref) || mq.addListener(applyMotionPref);
	applyMotionPref();
})();

// Hotspots tooltip focus for a11y
const hotspots = document.querySelectorAll('.hotspot');
hotspots.forEach(btn=>{
	btn.addEventListener('focus', ()=>btn.classList.add('hover'));
	btn.addEventListener('blur', ()=>btn.classList.remove('hover'));
});

// Before/after slider
(function(){
	const wrap = document.querySelector('.before-after');
	if(!wrap) return;
	const input = wrap.querySelector('input[type=range]');
	const before = wrap.querySelector('.before');
	if(!input || !before) return;
	function update(){
		const v = Number(input.value);
		before.style.clipPath = `inset(0 ${100-v}% 0 0 round 16px)`;
	}
	input.addEventListener('input', update);
	update();
})();

// Form submit (placeholder hook)
const form = document.querySelector('.lead-form');
const ctas = document.querySelectorAll('[data-segment]');
ctas.forEach(btn=>btn.addEventListener('click', ()=>{
	const seg = btn.getAttribute('data-segment');
	const select = document.querySelector('select[name="segment"]');
	if(select && seg){ select.value = seg; }
}));
form?.addEventListener('submit', (e)=>{
	e.preventDefault();
	const formData = new FormData(form);
	const payload = Object.fromEntries(formData.entries());
	console.log('Lead submit', payload);
	form.reset();
	alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
});
