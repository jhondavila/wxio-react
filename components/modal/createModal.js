import React from 'react';
import ReactDOM from 'react-dom';
import { Promise as BBPromise } from "bluebird";
BBPromise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true,
    // Enable async hooks
    asyncHooks: true,
});
const createConfirmation = (Component, unmountDelay = 2000, mountingNode) => {
    return (props) => {
        const wrapper = (mountingNode || document.body).appendChild(document.createElement('div'));

        const promise = new BBPromise((resolve, reject, onCancel) => {
            try {
                const instance = ReactDOM.render(
                    <Component
                        reject={reject}
                        resolve={resolve}
                        dispose={dispose}
                        {...props}
                    />,
                    wrapper
                );
                // console.log(render)
                onCancel(() => {
                    if (instance) {
                        instance.setState({
                            show: false
                        });
                    } else {
                        console.log("no exists instance")
                        console.trace(instance);
                    }
                    dispose();
                })
            } catch (e) {
                console.error(e);
                throw e;
            }
        })

        function dispose() {
            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(wrapper);
                setTimeout(() => {
                    if (document.body.contains(wrapper)) {
                        document.body.removeChild(wrapper)
                    }
                });
            }, unmountDelay);
        }

        return promise.then((result) => {
            dispose();
            return result;
        }, (result) => {
            dispose();
            return Promise.reject(result);
        });
    }
}

export default createConfirmation;