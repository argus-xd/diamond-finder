<template>
  <div class="cell" :class="{ open: cell.open, diamond: cell.diamond }" >
    {{ cell.value }}
  </div>
</template>

<script>
export default {
  props: {
    cell: Object
  }
};
</script>

<style scoped>
.cell {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.open {
  background-color: #a67f25;
}
.open.diamond {
  background-color: #19c2a9;
}
</style>