"use strict";

export class MultistompMessagesConverter {

    /**
     * @param ChangeMessage<Multistomp> message
     * @return Messages
     */
	static convert(message) {
		let msg = null;
		let details = new Messages.Details();

		if (message.is(MultistompCause.MULTISTOMP))
			msg = this.convertToPatch(message, details);

		else if (message.is(MultistompCause.PATCH))
			msg = this.convertPatch(message, details);

		else if (message.is(MultistompCause.EFFECT))
			msg = this.convertStatusEffect(message, details);

		else if (message.is(MultistompCause.PARAM))
			msg = this.convertSetParam(message, details);

		if (msg != null)
			return Messages.For(msg);
		else
			return Messages.For();
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertToPatch(message, details) {
		details.patch = message.causer.getIdCurrentPatch();

		return new Messages.Message(CommonCause.TO_PATCH, details);
	}

	static convertPatch(message, details) {
		if (!details.type == Details.TypeChange.PATCH_NAME)
			return Messages.Empty();

		details.value = message.realMessage().details.newValue;

		return new Messages.Message(CommonCause.PATCH_NAME, details);
	}

    /**
     * @param  ChangeMessage<Multistomp> message
     * @param  Details                   details
     *
     * @return Message
     */
	static convertStatusEffect(message, details) {
		let patch = message.nextMessage.causer;
		details.patch = message.causer.patchs.indexOf(patch);

		let effect = message.realMessage().causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		let cause = effect.hasActived() ? CommonCause.ACTIVE_EFFECT : CommonCause.DISABLE_EFFECT;

		return new Messages.Message(cause, details);
	}

    /**
     * @param ChangeMessage<Multistomp> message
     * @param Details                   details
     *
     * @return Message
     */
	static convertSetParam(message, details) {
		let patch = message.nextMessage.causer;
		let effect = message.nextMessage.nextMessage.causer;
		let idEffect = patch.effects.indexOf(effect);

		details.effect = idEffect;
		details.param = effect.params.indexOf(message.realMessage().causer);
		details.value = message.realMessage().causer.getValue();

		return new Messages.Message(CommonCause.SET_PARAM, details);
	}
}
