<template>
  <div class="search-container card">
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input
          class="input is-normal search-field"
          type="text"
          ref="searchInput"
          placeholder="Søk"
          :value="filterText"
          @input="e => filterText.value = e.target.value"
        >
      </p>
      <p class="control">
        <button
          class="button"
          @click="$emit('close')"
        >
          <span class="icon">
            <FontAwesomeIcon icon="xmark" />
          </span>
        </button>
      </p>
    </div>

    <StationList
      class="station-list"
      :station-info="stationInfo"
      :station-status="stationStatus"
      :filter-text="filterText"
      @item-click="(id) => $emit('selected-station', id)"
    />
  </div>
</template>

<script setup>
import StationList from './StationList.vue'
import {onMounted, ref} from 'vue'

const filterText = ref("")
const searchInput = ref(null)

defineProps({
  stationInfo: { type: Object, default: () => ({}) },
  stationStatus: { type: Object, default: () => ({}) }
})

defineEmits(['selected-station', 'close'])

onMounted(() => {
  searchInput.value.focus()
})
</script>

<style scoped>
.search-container {
  flex-direction: column;
  display: flex;
  background: #f5f5f5;
  padding: 8px;
}

.station-list {
  overflow: auto;
}
</style>
