<template>
    <div class="bootstrap-fs-modal">
        
        <router-link to="/tour">Start the tour</router-link>
        <div class="form-check form-check-inline">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" name="" id="" :value="$store.state.config.simulateLocation" @change="$store.commit('setSimulateLocation', !$store.state.config.simulateLocation)"> Simulate Location
            </label>
        </div>
    </div>
</template>

<script>
   

    export default {

    }

</script>
