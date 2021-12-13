<template>
    <div class="container">
        <div class="card mt-2">
            <div class="card-body">
                <h5 class="card-title">Debug Options</h5>
                <div class="form-check">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" name="" id=""
                            :checked="$store.state.config.simulateLocation"
                            @change="$store.commit('setSimulateLocation', !$store.state.config.simulateLocation)">
                        Simulate
                        Location
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" name="" id=""
                            :checked="$store.state.config.simulateMobile"
                            @change="$store.commit('setSimulateMobile', !$store.state.config.simulateMobile)">
                        Simulate Mobile
                    </label>
                </div>
                <div>
                    <p>{{ $store.state.locks }}</p>
                    <button class="btn btn-outline-primary" @click="$store.commit('resetLocks')">Reset Locks</button>
                </div>
                <h6 class="mt2">Language</h6>
                <div v-for="(language, key) in languages" :key="key" class="form-check">
                <div class="form-check">
                    <label class="form-check-label">
                    <input type="radio" class="form-check-input" v-model="$i18n.locale" name="locale" id="" :value="key">
                    {{ key }}
                  </label>
                </div>
                </div>
                
                <h6 class="mt-2" v-if="$store.getters.deepdives.length > 0">Deep Dives</h6>
                <ul class="list-group">
                    <li class="list-group-item" v-for="(deepdive, index) in $store.getters.deepdives" :key="index">{{deepdive}}</li>
                </ul>
                <button class="btn btn-outline-primary" @click="$store.commit('resetDives')">Reset Deep Dives</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>