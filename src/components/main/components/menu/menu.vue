<nav component class="c-main-menu">
    <div class="options">

        <div :aria-labelledby="$t('recent activity')"
            class="option activity test-menubar-activity"
            :class="classes('activities')"
            role="button"
            @click="setLayer('activities')" >
            <icon name="recent"/>
        </div>

        <div :aria-labelledby="$t('contacts')"
            :class="classes('contacts', true)"
            class="option contacts test-menubar-contacts"
            role="button"
            @click="setLayer('contacts')">
            <icon name="contacts"/>
        </div>

        <div :aria-labelledby="$t('dialpad')"
            :class="classes('calls')"
            class="option calls test-menubar-calls"
            @click="setLayer('calls')"
            role="button">
             <icon name="phone"/>
        </div>

        <div v-if="plugin.menubarIcon" class="option" :class="classes(plugin.menubarIcon, plugin.menubarTransferHint)"
            v-for="plugin in customPlugins" @click="setLayer(plugin.menubarIcon)"
            role="button" :aria-labelledby="plugin.name">
            <icon :name="plugin.menubarIcon"/>
        </div>
    </div>
</nav>
