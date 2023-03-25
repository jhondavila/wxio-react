const onChangeValue = (keyForm, keyValidator, keyValidation) => {

    return async function (field, event) {
        let value = event.target.value;
        if(value.trim() == ""){
            value = null;
        }
        let form = this.state[keyForm];
        form[field] = value;
        this.setState({
            [keyForm]: form,
        });
        if (keyValidator && keyValidation) {
            let validation = this.state[keyValidation];
            try {
                await this.state[keyValidator].validate({ [field]: value });
            } catch (error) {
                let { errors, fields } = error;
                if (fields[field]) {
                    validation[field] = false;
                } else {
                    validation[field] = null;
                }
            }
            this.setState({
                [keyValidation]: validation
            });
        }
        //  else {
        //     this.setState({
        //         [keyForm]: form
        //     });
        // }
    }
};

const validateForm = (keyForm, keyValidator, keyValidation) => {

    return async function () {
        try {
            await this.state[keyValidator].validate(this.state[keyForm]);
            return true;
        } catch (error) {
            let { errors, fields } = error;
            let validation = this.state[keyValidation];
            // debugger
            for (let p in this.state[keyValidation]) {
                if (fields[p]) {
                    validation[p] = false;
                } else {
                    validation[p] = null;
                }
            }
            this.setState({
                [keyValidation]: validation
            });
            return false;
        }
    }
};


export { onChangeValue, validateForm };