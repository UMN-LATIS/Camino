<script>
export default {
    props: ["text"],
    methods: {
        renderContent() {
            try {
        // let ast = this.tokenizer
        //   .input(this.content)
        //   .ast()
        // let content = ast
        //   .map(renderToken)
        //   .join('')

            // var regex = /\[(.*)\]/g, result = []; searchText.match(/\[(.*?)\]/)
            var matches = this.text.match(/\[(.*?)\]/g);
            var localText = this.text;
            if(matches) {
                matches.forEach((match) => {
                    localText = localText.replace(match, `<hotword text='${match}'></hotword>`);
                })
            }
            
            return "<p>" + localText + "</p>";
         } catch (err) {
        // TODO use error component
            console.error(err)
            return `<div class="error">${err.message}</div>`
        }
        }
    },
    render(h) {
        return h(Vue.component('hotword-wrapper', {
            template: this.renderContent()
        }))
    }
}
</script>