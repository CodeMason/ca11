module.exports = (app) => {

    return {
        computed: {
            filteredActivity: function() {
                let activity = this.activity.sort(app.utils.sortByMultipleKey(['date'], -1))
                if (this.filters.reminders) activity = activity.filter((i) => i.remind)
                if (this.filters.missedIncoming) activity = activity.filter((i) => (i.status === 'missed'))
                if (this.filters.missedOutgoing) activity = activity.filter((i) => (i.status === 'unanswered'))
                return activity
            },
        },
        methods: Object.assign({
            callRecent: function(recent) {
                let endpoint
                if (recent.contact) endpoint = this.contacts[recent.contact].endpoints[recent.endpoint].number
                else endpoint = recent.endpoint

                app.emit('bg:calls:call_create', {description: {endpoint, protocol: 'sip'}, start: true})
            },
            classes: function(block, modifier) {
                let classes = {}
                if (block === 'remind-button') {
                    if (modifier.remind) classes.active = true
                } else if (block === 'filter-missed-incoming') {
                    if (this.filters.missedIncoming) classes.active = true
                } else if (block === 'filter-missed-outgoing') {
                    if (this.filters.missedOutgoing) classes.active = true
                } else if (block === 'filter-reminders') {
                    if (this.filters.reminders) classes.active = true
                }
                return classes
            },
            toggleFilterMissedIncoming: function() {
                app.setState({activity: {filters: {missedIncoming: !app.state.activity.filters.missedIncoming}}}, {persist: true})
            },
            toggleFilterMissedOutgoing: function() {
                app.setState({activity: {filters: {missedOutgoing: !app.state.activity.filters.missedOutgoing}}}, {persist: true})
            },
            toggleFilterReminders: function() {
                app.setState({activity: {filters: {reminders: !app.state.activity.filters.reminders}}}, {persist: true})
            },
            toggleReminder: function(activity) {
                activity.remind = !activity.remind
                app.setState(activity, {path: `activity.activity.${this.activity.findIndex(i => i.id === activity.id)}`, persist: true})
            },
        }, app.helpers.sharedMethods()),
        mounted: function() {
            // Mark activity as read as soon the component is opened.
            app.setState({activity: {unread: false}}, {persist: true})
        },
        render: templates.activity.r,
        staticRenderFns: templates.activity.s,
        store: {
            activity: 'activity.activity',
            contacts: 'contacts.contacts',
            filters: 'activity.filters',
            tabs: 'ui.tabs.activity',
            user: 'user',
        },
        watch: {
            // Updating all activity items after one changed
            // activity item is a bit inefficient, but fine
            // for now. Optimize this later.
            activity: {
                deep: true,
                handler: function(activity) {
                    app.setState({activity: {activity}}, {persist: true})
                },
            },
        },
    }
}
