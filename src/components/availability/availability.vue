<component class="c-availability">

    <Field name="dnd_availability" type="checkbox"
        :disabled="!webrtc.enabled"
        :label="$t('DND')"
        :model.sync="dnd"/>
</component>
