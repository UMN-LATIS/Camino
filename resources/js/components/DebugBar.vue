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
                <h6 class="mt2">Language</h6>
                <div class="form-check">
                    <label class="form-check-label">
                    <input type="radio" class="form-check-input" v-model="$i18n.locale" name="locale" id="" value="English">
                    English
                  </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                    <input type="radio" class="form-check-input" v-model="$i18n.locale" name="locale" value="Español">
                    Spanish
                  </label>
                </div>
                <h6 class="mt-2" v-if="$store.state.hotwords.length > 0">Hotwords</h6>
                <ul class="list-group">
                    <li class="list-group-item" v-for="(hotword, index) in $store.state.hotwords" :key="index">{{hotword}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>