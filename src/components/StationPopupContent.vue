<template>
  <StationInfo
    class="popup-content"
    :station="station"
  />
</template>

<script setup>
import '../assets/app.scss'
import {inject, isRef} from "vue";
import StationInfo from "@/components/StationInfo";

const station = inject("station")
console.log ("isref",isRef(station))
</script>

<style scoped>
.popup-content {
  padding: .4em .8em 0 .8em;
}
</style>