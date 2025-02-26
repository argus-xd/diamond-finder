<template>
  <h1>Сапёр на оборот</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <main>
    <RouterView />
  </main>
</template>

<script>
export default {
  name: 'App'
};
</script>
