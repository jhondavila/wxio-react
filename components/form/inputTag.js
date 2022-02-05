import React from 'react';
import { ModalSearch } from "./ModalSearch";
import { Store } from "Wx/store"

export class InputTag extends React.Component {
  constructor(opts) {
    super(opts);

    this.state = {
      value: [
      ],
      internalValue: [],
      internalStore: null,
      options: this.props.options
    };

  }
  parseValue(value) {
    if (typeof value === "string") {
      value = value.split(this.props.separator || ",");
    } else if (value._isStore) {
      value = value.getData();
    } else {
      value = value || [];
    }
    // debugger
    return value;
  }

  createLocalStore(data) {
    let store = new Store({
      fields: {
        text: "string"
      },
      clearOnPageLoad: false,
      proxy: {
        type: "localstorage"
      }
    })

    store.add(data.map(i => ({
      id: i,
      text: i
    })));

    return store;
  }

  loadValues() {
    let { value, options } = this.props;
    //debugger
    let castValues = value._isStore ? value : this.parseValue(value);

    let storeOptions;
    let internalValue;
    // debugger

    if (options._isStore) {
      storeOptions = options;
      internalValue = castValues.map(item => {
        return storeOptions.find({ [this.props.valueTag]: item });
      }).filter(i => !!i);
    } else if (Array.isArray(options)) {

      storeOptions = this.createLocalStore(options);

      if (this.props.value._isStore) {
        internalValue = this.props.value.getData();
        internalValue.forEach(i => {
          storeOptions.removeById(i.get([this.props.valueTag]));
        });
      } else {
        internalValue = castValues.map(item => {
          storeOptions.removeById(item);
          return item;
        }).filter(i => !!i);
      }
    }

    this.setState({
      internalValue: internalValue,
      internalStore: storeOptions,
    });
  }
  componentDidMount() {

    this.loadValues();

    //this.focusInput();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.loadValues();
    } else if (prevProps.options !== this.props.options) {
      this.loadValues();
    }
  }

  onTagChange = (onTagChange) => {
    let { value } = this.props;
    let outPutVal;
    if (typeof value === "string") {

      outPutVal = onTagChange.map(i => i[this.props.valueTag || "id"]).join(this.props.separator || ",");
    } else {

      outPutVal = onTagChange;
    }
    if (this.props.onChange) {
      this.props.onChange(outPutVal);
    }
  }

  removeTag = (i) => {

    if (this.props.value._isStore) {
      this.props.value.remove(i);
      this.onUpdateValues();
    } else {
      let internalValue = this.state.internalValue;
      var index = internalValue.indexOf(i);
      if (index !== -1) {
        internalValue.splice(index, 1);
      }
      this.setState({
        internalValue: [
          ...internalValue
        ]
      }, () => {
      });
    }

  }

  inputKeyDown = (e) => {
    const val = e.target.value;

    if (e.key === 'Enter' && val || e.key === 'Tab' && val) {
      if (this.state.vale.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.createTag(val);
    } else if (e.key === 'Backspace' && !val) {
      this.removeTag(this.state.vale.length - 1);
    }
  }

  OutTagFocus = (e) => {
    const val = e.target.value;
    if (val) {
      this.createTag(val)
    }
  }

  onUpdateValues() {

    this.loadValues();

    let outPutVal = this.state.internalValue;

    if (this.props.onChange) {
      this.props.onChange(outPutVal);
    }
  }

  // createTag(val) {
  //   let curValue = this.props.value;
  //   let newTags;
  //   if (curValue === "string") {
  //     newTags = [...this.state.value, val[this.props.valueField || "id"]];
  //     // eventValue = newTags.join(this.props.separator || ",");
  //   } else {
  //     newTags = [...this.state.value, val]
  //     // eventValue = newTags;
  //   }
  //   this.setState({ value: newTags });

  //   this.onTagChange(newTags);
  //   this.tagInput.value = null;
  // }

  handlerClose = () => {
    this.setState({
      show: false
    })
  }


  onKeyPress = (e) => {
    e.preventDefault();
    // if (e.key === "Enter") {
    this.setState({
      show: true
    })
    // }
  }

  onClick() {
    this.setState({
      show: true
    })
  }
  render() {
    const { internalValue, internalStore } = this.state;
    return (
      <>
        <div className="input-tag" >
          <ul className="input-tag__tags">
            {internalValue.map((tag, i) => {
              let text;
              let key;
              let element;
              if (typeof tag === "string") {
                text = tag;
                key = tag;
                element = i;
              } else if (tag && tag._isModel) {

                key = tag.get(this.props.displayTag || "id");
                text = tag.get(this.props.displayTag || "text");
                element = tag;
              } else if (typeof tag === "object") {
                key = tag[this.props.valueTag || "id"]
                text = tag[this.props.displayTag || "text"];
                element = i;
              }
              return (
                <li key={key}>
                  {
                    text
                  }
                  <a href="#" onClick={() => { this.removeTag(element); }}><i className="far fa-trash-alt"></i></a>
                </li>
              )
            })}
            <li className="input-tag__tags__input">
              <input type="text"
                {
                ...(
                  this.state.options ? {
                    onKeyPress: this.onKeyPress
                  } :
                    {
                      onKeyDown: this.inputKeyDown,
                      onBlur: this.OutTagFocus
                    }
                )
                }
                ref={c => { this.tagInput = c; }}


              />
              {
                this.state.options ? <i className="fad fa-search" onClick={this.onClick.bind(this)}></i> : null
              }
            </li>
          </ul>
        </div>
        {
          internalStore &&
          <ModalSearch
            show={this.state.show}
            onClose={this.handlerClose}
            columns={this.props.columns || [
              {
                text: "Opción",
                dataIndex: "text"
              }
            ]}
            store={internalStore}
            title={this.props.title}
            selectRecord={(record) => {

              // let newValue = {
              //   [this.props.valueTag || "id"]: record.get(this.props.valueField || this.props.valueTag || "id"),
              //   [this.props.displayTag || "text"]: record.get(this.props.displayField || this.props.displayTag || "text")
              // };
              // // debugger
              // if (value._isStore) {
              if (this.props.value._isStore) {
                this.props.value.add({
                  [this.props.valueTag]: record.text
                });
                this.onUpdateValues();
              } else {
                this.setState({
                  internalValue: [...internalValue, record]
                }, () => {
                  this.onUpdateValues()
                });
              }
            }}
          />
        }
      </>
    );
  }
}
