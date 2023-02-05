<script setup></script>

<template>
	<div class="aside">
		<div class="aside-item">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
.aside:hover {
	visibility: visible;
}
.aside {
	visibility: hidden;
	box-sizing: border-box;
	position: relative;
	left: calc(100% + 1em);
	top: calc(-2em - 10px);
	z-index: 1;
	min-height: 3rem;

	background-color: black;
	padding: 0.5em 1em;

	border-radius: 8px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.aside-item {
	white-space: pre;
	user-select: none;
	cursor: pointer;
}
</style>
