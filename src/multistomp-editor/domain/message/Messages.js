class Messages extends MessagesCollection {
    /**
     * @param Cause cause
     * @return Messages
     */
    getBy(cause) {
        let returned = new Messages();
        for (let message of this)
            if (message.is(cause))
                returned.add(message);
        return returned;
    }
}
//# sourceMappingURL=Messages.js.map