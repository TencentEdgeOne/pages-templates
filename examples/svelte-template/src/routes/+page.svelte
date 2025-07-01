<script>
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/atom-one-dark.css';
	import xml from 'highlight.js/lib/languages/xml';
	import javascript from 'highlight.js/lib/languages/javascript';

	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('javascript', javascript);

	let codeEl;
	const codeSnippet = `<script>
  let count = 0;
  function handleClick() {
    count += 1;
  }
<\/script>

<button on:click={handleClick}>
  Clicked {count} {count === 1 ? 'time' : 'times'}
<\/button>`;

	onMount(() => {
		if (codeEl) {
			hljs.highlightElement(codeEl);
		}
	});
</script>

<style>
	:global(body) {
		margin: 0;
		background: linear-gradient(180deg, #f3f5f8 0%, #e8eef5 100%);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: #333;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		text-align: center;
		padding: 2rem 1rem;
		box-sizing: border-box;
	}

	.container {
		max-width: 720px;
		width: 100%;
	}

	.intro {
		margin-bottom: 4rem;
	}

	.logo {
		width: 90px;
		height: 90px;
		margin-bottom: 1.5rem;
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
	}

	h1 {
		font-size: 3rem;
		font-weight: 800;
		color: #1a202c;
		margin: 0 0 1.5rem;
		line-height: 1.2;
	}

	p.subtitle {
		font-size: 1.25rem;
		line-height: 1.75;
		color: #4a5568;
		max-width: 48rem;
		margin: 0 auto;
	}

	.code-wrapper {
		margin: 0 0 4rem;
		width: 100%;
		text-align: left;
    line-height: 1.4rem;
	}

	.code-wrapper pre {
		background-color: #282c34; /* atom-one-dark background */
		border-radius: 12px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.card {
		background-color: white;
		border-radius: 12px;
		padding: 2rem;
		text-align: left;
		text-decoration: none;
		color: inherit;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		display: block;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: #2d3748;
	}

	.card h2 .arrow {
		transition: transform 0.2s ease;
		display: inline-block;
	}

	.card:hover h2 .arrow {
		transform: translateX(4px);
	}

	.card p {
		font-size: 1rem;
		line-height: 1.5;
		color: #718096;
		margin: 0;
	}
</style>

<main>
	<div class="container" in:fly={{ y: 50, duration: 800, delay: 300, easing: cubicOut }}>
		<div class="intro">
			<h1>Welcome to the EdgeOne Pages Svelte Template</h1>
			<p class="subtitle">
				This is a starter template for SvelteKit on EdgeOne Pages, designed to help you quickly
				build and deploy your Svelte applications.
			</p>
		</div>

		<div class="code-wrapper">
			<pre><code class="language-xml" bind:this={codeEl}>{codeSnippet}</code></pre>
		</div>

		<div class="card-grid">
			<a
				href="https://edgeone.ai/document/160427672992178176"
				target="_blank"
				rel="noopener noreferrer"
				class="card"
			>
				<h2>EdgeOne Pages Docs <span class="arrow">→</span></h2>
				<p>Learn how to configure, deploy, and manage your projects on EdgeOne Pages.</p>
			</a>
			<a
				href="https://kit.svelte.dev/docs"
				target="_blank"
				rel="noopener noreferrer"
				class="card"
			>
				<h2>SvelteKit Docs <span class="arrow">→</span></h2>
				<p>Dive deep into SvelteKit to build powerful and high-performance web applications.</p>
			</a>
		</div>
	</div>
</main>
