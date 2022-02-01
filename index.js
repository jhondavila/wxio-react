import moment from 'moment';
import * as _ from "lodash";
import Handlebars from "handlebars";

let propToString = Object.prototype.toString;

class Utils {
    i18next = null;
    checkJSONParse(value) {
        if (typeof value === "string") {
            return JSON.parse(value);
        } else {
            return value;
        }
    }
    isEmptyImage(image) {
        if (image == "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==") {
            return true;
        } else {
            return false;
        }
    }

    trimUrl(href) {
        if (href && href.trim) {
            return href.trim();
        } else {
            return null;
        }
    }
    resolveSrc(str) {
        const regex = /(src="[\w\\//.]*"|src='[\w\\//.]*')/gmi;
        let m;
        try {
            let list = [];
            while ((m = regex.exec(str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach((match, groupIndex) => {

                    if (list.indexOf(match) === -1) {

                        list.push(match);
                        let find = match.replace(/src=("|')/gmi, "").replace(/("|')$/gmi, "");
                        let url = this.pathResolve(find);
                        str = str.replace(find, url);
                    }
                });
            }
        } catch (error) {

        }
        return str;
    }
    createBuffered(fn, buffer, scope, args) {
        var timerId;

        return function () {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function () {
                fn.apply(me, callArgs);
            }, buffer);
        };
    }


    formatEMMMDDYYYY(date) {
        return this.textCapitalize(this.textExtract(date.format("ddd"))) + " " +
            date.format("DD") + " " +
            this.textCapitalize(this.textExtract(date.format("MMM"))) + ", " + date.format("YYYY");
    }

    formatDDddddMMMM(date) {
        return `${date.format("dddd DD")}${date.locale() == "es" ? " de " : " "}${date.format("MMMM")}`
    }

    formatDDddddMMMMCapitalize(date) {
        return `${this.textCapitalize(date.format("dddd DD"))}${date.locale() == "es" ? " de " : " "}${this.textCapitalize(date.format("MMMM"))}`
    }

    textExtract(text) {
        return text.substring(0, text.length - 1);
    }

    textCapitalize(text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1, text.length);
    }
    checkHttpUrl(url) {
        let regExp = new RegExp("^(http|https):\/\/", "gmi");
        if (url) {
            if (regExp.exec(url)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    urlJoin(basePath) {
        if (basePath === "./") {
            basePath = document.location.origin;
        }
        let regExp = new RegExp("^(http|https):\/\/", "gmi");
        let regExpEnd = new RegExp("(\/)$", "gmi");
        if (regExpEnd.exec(basePath)) {
            basePath = basePath.substring(0, basePath.length - 1);
        }

        let appends = Array.prototype.slice.call(arguments, 1, arguments.length);
        let path = appends[0];

        if (path) {
            if (!regExp.exec(path)) {
                if (path.substring(0, 1) === "/") {
                    path = basePath + path;
                } else {
                    path = basePath + "/" + path;
                }
            }
        }
        if (appends.length > 1) {
            path = this.urlJoin.apply(this, [path].concat(appends.slice(1, appends.length)));
        }
        return path;
    }


    formatPerc(value) {
        if (!value) {
            return 0;
        }

        if (value.toString().indexOf(".") > -1) {
            return value.toFixed(1);
        }
        return value;
    }


    formatSpeakers(item) {
        if (!item.formatSpeakers) {
            let names = [];
            let speakers = item.exhibitors || [];

            speakers = speakers.sort((a, b) => {
                return a.order - b.order;
            });
            for (let x = 0; x < speakers.length; x++) {
                names.push(speakers[x].name);
            }
            item.formatSpeakers = names.join(", ");
        }
        return item.formatSpeakers;
    }



    // tOpts({ space, t, lan }) {
    //     return i18next.t(`namespace1:${text}`)
    // }    
    setI18next(i18next){
        this.i18next = i18next;
    }
    t(text, opts) {
        if(this.i18next){
            return this.i18next.t(`${text}`, { ns: "namespace1", ...opts })
        }else{
            return text;
        }
    }


    capitalize(str) {
        if (str) {
            str = str.charAt(0).toUpperCase() + str.substr(1);
        }
        return str || '';
    }
    isArray = Array.isArray
    isObject(value) {
        return propToString.call(value) === "[object Object]";
    }
    isEmpty(value, allowEmptyString) {
        return (
            value == null ||
            (!allowEmptyString ? value === "" : false) ||
            (this.isArray(value) && value.length === 0)
        );
    }
    parseToForm(form, root, data) {
        if (this.isArray(data)) {
            if (this.isEmpty(data)) {
                form.append(`${root}`, "[]");
            } else {
                let row;
                for (let x = 0; x < data.length; x++) {
                    row = data[x];
                    this.parseToForm(form, `${root}[${x}]`, row);
                }
            }
        } else if (this.isObject(data)) {
            for (let p in data) {
                this.parseToForm(form, `${root}[${p}]`, data[p]);
            }
        } else {
            form.append(`${root}`, data);
        }
    }
    pause(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }


    searchImageAspectRatio(sources, width, height, perc, type) {
        let forceType = type ? true : false;
        if (!type) {
            type = width > height && perc > 5 ? "landscape" : "portrait";
        }
        let filterList = _.filter(sources, i => {
            return i.type === type;
        });
        let find;
        for (let x = 0; x < filterList.length; x++) {
            let i = filterList[x];
            if (perc >= i.perc_ar_start && i.perc_ar_end > perc) {
                find = i;
                break;
            }
        }

        if (!find && !forceType) {
            find = this.searchImageAspectRatio(sources, width, height, perc, type);
        }
        if (!find) {
            find = sources[0];
        }
        return find;
    }
    buildTreeNode(applications, parentId, nodeKey, parentKey, fn) {
        var app_tree = [];
        // var ctrl = this;
        if (Array.isArray(applications)) {
            applications.forEach(app => {
                if (app[parentKey] === parentId) {
                    var children = this.buildTreeNode(
                        applications,
                        app[nodeKey],
                        nodeKey,
                        parentKey,
                        fn
                    );
                    if (children.length > 0) {
                        app["children"] = children;
                    }
                    if (children.length === 0) {
                        if (app["leaf"] === 0) {
                            app["children"] = [];
                            app["leaf"] = false;
                        } else {
                            app["leaf"] = true;
                        }
                    }
                    if (fn) {
                        fn(app, children, parentId);
                    }
                    app_tree.push(app);
                }
            });
        }
        return app_tree;
    }
    leftPad(string, size, character) {
        var result = String(string);
        character = character || " ";
        while (result.length < size) {
            result = character + result;
        }
        return result;
    }

    format = (...args) => {



        let params = Array.prototype.slice.call(args, 1);
        let regexp = /{[0-9]*}/gmi;
        if (typeof params[0] == "object") {
            // debugger
            regexp = /{[A-z]*}/gmi;
            params = params[0];
        }



        let m;
        let output = args[0];
        let str = args[0];
        while ((m = regexp.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regexp.lastIndex) {
                regexp.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
                let number = match;
                number = number.replace(/[{}]/gmi, "");
                let finder = match;
                finder = finder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                if (params[number]) {
                    output = output.replace(new RegExp(finder, "gmi"), params[number])
                } else {
                    output = output.replace(new RegExp(finder, "gmi"), '')
                }
            });
        }
        return output;
    }
    getQuestionNoVote(data) {
        let index = false;
        for (let x = 0; x < data.length; x++) {
            let item = data[x];
            let hasVote = false;
            if (item.options && item.options.length > 0) {
                _.forEach(item.options, (i) => {
                    if (i.vote == 1) {
                        hasVote = true;
                    }
                });
            } else if (item.options && item.options.length == 0) {
                if (item.response.length > 0) {
                    hasVote = true;
                }
            }
            if (hasVote === false) {
                index = x;
                break;
                // questions.push(item);
            }
        }
        return index;
    }
    hasVoteQuestion(item) {
        let hasVote = false;
        if (item && item.options) {
            _.forEach(item.options, (i) => {
                if (i.vote == 1) {
                    hasVote = true;
                }
            });
        }
        return hasVote;
    }

    template(tpl, data) {
        return _.template(tpl, {
            interpolate: /{{([\s\S]+?)}}/g,
            imports: {
                window: "",
                data
            }
        })();
    }

    tplCompile(tpl) {
        let template = Handlebars.compile(tpl || "");
        return template;
    }

    String = {
        format: (...args) => {
            let regexp = /{[0-9]*}/gmi;
            let params = Array.prototype.slice.call(args, 1);


            let m;
            let output = args[0];
            let str = args[0];
            while ((m = regexp.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regexp.lastIndex) {
                    regexp.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    // console.log(`Found match, group ${groupIndex}: ${match}`);
                    let number = match;
                    number = number.replace(/[{}]/gmi, "");
                    let finder = match;
                    finder = finder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                    if (params[number]) {
                        output = output.replace(new RegExp(finder, "gmi"), params[number])
                    } else {
                        output = output.replace(new RegExp(finder, "gmi"), '')
                    }
                });
            }
            return output;
        }
    }


}


export default new Utils();