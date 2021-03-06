/**
* The Activity module is mainly used to show recent Call
* history and allow the user to make reminders from
* activity entries.
* @module ModuleActivity
*/
const Plugin = require('ca11/lib/plugin')

// Cap the maximum amount of stored activities, so the
// localStorage won't be grinded to a halt.
const MAX_ACTIVITIES = 50

/**
* Main entrypoint for Activity.
* @memberof AppBackground.plugins
*/
class PluginActivity extends Plugin {
    /**
    * @param {AppBackground} app - The background application.
    */
    constructor(app) {
        super(app)

        this.app.on('bg:calls:call_rejected', ({call}) => {
            let activity = {
                description: {
                    endpoint: call.endpoint,
                    protocol: call.protocol,
                },
                icon: `call-missed-${call.type}`,
                status: call.type === 'outgoing' ? 'unanswered' : 'missed',
            }

            this.addActivity(activity)
        })

        this.app.on('bg:calls:call_ended', ({call}) => {
            let activity = {
                description: {
                    endpoint: call.endpoint,
                    protocol: call.protocol,
                },
                icon: `call-${call.type}`,
                status: 'finished',
            }

            this.addActivity(activity)
        })
    }


    /**
    * Initializes the module's store.
    * @returns {Object} The module's store properties.
    */
    _initialState() {
        return {
            activities: [],
            filters: {
                missedIncoming: false,
                missedOutgoing: false,
                reminders: false,
            },
            unread: false,
        }
    }


    /**
    * Adds some default attributes to an activity and
    * does some additional bookkeeping.
    * @param {String} [activity] - Endpoint to link to the activity.
    */
    addActivity(activity) {
        activity.date = new Date().getTime()
        activity.id = shortid.generate()
        activity.remind = false

        let activities = this.app.state.activities.activities
        activities.unshift(activity)

        if (activities.length > MAX_ACTIVITIES) {
            // Check which discarded activities are reminders first.
            let reminders = activities.slice(MAX_ACTIVITIES).filter((i) => i.remind)
            // Slice the list of activities and add the reminders at the end.
            activities = activities.slice(0, MAX_ACTIVITIES).concat(reminders)
        }

        // New activity is added. Mark it as unread when the current layer
        // is not set on `activity`. The unread property is deactivated again
        // when the activity component mounts.
        this.app.setState({
            activities: {
                activities,
                unread: this.app.state.ui.layer !== 'activity',
            },
        }, {persist: true})
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[activity] `
    }
}

module.exports = PluginActivity
