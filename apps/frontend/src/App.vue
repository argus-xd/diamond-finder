<template>
  <h1>Сапёр на оборот</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/"> Начать новую игру </RouterLink> <br><br>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script>
export default {
  name: 'App'
};
</script>
