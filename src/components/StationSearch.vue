<template>
  <div class="search-container card">
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input
          ref="searchInput"
          class="input is-normal search-field"
          type="text"
          placeholder="Søk"
          :value="filterText"
          @input="e => filterText = e.target.value"
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
      :stations="stations"
      :filter-text="filterText"
      @station-click="station => $emit('selected-station', station )"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import StationList from '@/components/StationList.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const filterText = ref("")
const searchInput = ref(null)

defineProps({
  stations: { type: Array, default: () => ([]) }
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
