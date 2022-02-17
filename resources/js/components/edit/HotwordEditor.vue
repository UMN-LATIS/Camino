<template>
  <div v-if="tour">
    <router-link :to="{ name: 'editTour', params: { tourId: tourId } }">{{
      tour.title
    }}</router-link>
    <div v-for="(language, key) in hotWords" :key="key">
      <h2>{{ key }}</h2>

      <div v-for="(hotword, hwkey) in language" :key="hwkey">
        <label :for="'field' + hwkey" class="">{{ hotword }}</label>
        <hotwords-text-editor
          :editorData.sync="tour.tour_content.hotWords[hotword]"
          :idkey="'field' + hwkey"
        ></hotwords-text-editor>
        <!-- <textarea :value="tour.tour_content.hotWords[hotword]" @input="tour.tour_content.hotWords[hotword] = $event.target.value"></textarea> -->
      </div>
      <hr />
    </div>
    <button @click="save" class="btn btn-primary">Save</button
    ><save-alert :showAlert.sync="showAlert" />
  </div>
</template>

<script>
export default {
  props: ["tourId"],
  data() {
    return {
      tour: null,
      showAlert: false,
    };
  },
  computed: {
    hotWords: function () {
      // walk the tour and find all of the hotwords
      var foundHotwords = this.tour.stops
        .map((s) => {
          return s.stop_content.stages.map((stage) => {
            var cleanedMatches = [];
            if (!stage.text) {
              return [];
            }
            Object.entries(stage.text).forEach(([key, value]) => {
              if (value) {
                var root = document.createElement("div");
                root.innerHTML = value;
                var texts = [].map.call(
                  root.querySelectorAll("hotword"),
                  function (v) {
                    return v.textContent || v.innerText || "";
                  }
                );

                if (texts) {
                  cleanedMatches.push({ [key]: texts });
                }
              }
            });
            return cleanedMatches;
          });
        })
        .flat(4);
      // group the hotwords by langauge and de-dupe
      var groupedHotwords = foundHotwords.reduce((r, a) => {
        var key = Object.keys(a)[0];
        var entries = Object.values(a)[0];
        // use a new set and spread to de-dupe the two arrays
        r[key] = [...new Set([...(r[key] || []), ...entries])];
        return r;
      }, {});

      // if there are hotwords that aren't already in the tour, create them.
      Object.values(groupedHotwords).forEach((language) => {
        language.forEach((hw) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              this.tour.tour_content.hotWords,
              hw
            )
          ) {
            this.tour.tour_content.hotWords[hw] = "";
          }
        });
      });
      return groupedHotwords;
    },
  },
  methods: {
    save: function () {
      axios.put("/creator/edit/" + this.tour.id, this.tour).then(() => {
        this.showAlert = true;
      });
    },
  },
  mounted: function () {
    axios.get("/creator/edit/" + this.tourId).then((res) => {
      if (res.data.tour_content.hotWords.length == 0) {
        this.$set(res.data.tour_content, "hotWords", {});
      }
      this.tour = res.data;
    });
  },
};
</script>
