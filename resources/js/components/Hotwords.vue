<script>
export default {
    props: ["text"],
    methods: {
        renderContent() {
            try {
            return "<div>" + this.text + "</div>";
         } catch (err) {
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