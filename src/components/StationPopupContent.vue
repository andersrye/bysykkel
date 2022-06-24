<template>
  <StationInfo
    class="popup-content"
    :station="station"
  />
</template>

<script setup>
import {inject} from "vue"
import StationInfo from "@/components/StationInfo.vue"

const station = inject("station")
</script>

<style scoped>
.popup-content {
  padding: .4em .8em 0 .8em;
}
</style>