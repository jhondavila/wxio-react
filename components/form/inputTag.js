import React from 'react';
import { ModalSearch } from "./ModalSearch";
import PropTypes from 'prop-types';
import { Store } from "Wx/store"
import "./InputTag.scss";

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
      value = value.split(this.props.separator || ",");// 01,0,2
    } else if (value._isStore) {
      value = value.getData();//[{id : "01", text : "FACTURA"}]
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

  async loadValues() {
    let { value, options } = this.props;
    //debugger
    let castValues = value ? await this.parseValue(value) : null;

    let storeOptions;
    let internalValue;
    //debugger

    if (options._isStore) {
      // cual es la propiedad del store value //canal_id
      // cual es la propiedad a comparar del store options // canales=> id_canal
      
      await options.load();
      storeOptions = options;
      //debugger

      internalValue = castValues.map(item => {
      
        if (storeOptions.find({ [this.props.valueTag]: value._isStore ? item[this.props.valueField] : item })){
          console.log(item)
          return item;
        }
        //return storeOptions.find({ [this.props.valueTag]: value._isStore ? item[this.props.valueField] : item });;
      
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
        <div className="input-tag" disabled={this.props.disabled}>
          <div className="input-tag-content">
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
                  <li key={key} disabled={this.props.disabled}>
                    {
                      text
                    }
                    {
                      !this.props.disabled ? <a href="#" onClick={() => { this.removeTag(element); }}><i className="far fa-trash-alt"></i></a>: null
                    }
                    
                  </li>
                )
              })}
              <li className="input-tag__tags__input">
                {
                  /*
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
                    */
                }
              </li>
            </ul>
          </div>
          <div>
            {
              this.state.options ? <i className="fad fa-search" onClick={this.onClick.bind(this)}></i> : null
            }
          </div>
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
              if (this.props.value._isStore) {
                if(record._isModel){

                  console.log(this.props.value, record[record.valueTag]);
                  this.props.value.add({
                    [this.props.valueTag]: record[this.props.valueTag],
                    [this.props.displayTag]: record[this.props.displayTag]
                  });
                }else{
                  this.props.value.add({
                    [this.props.valueTag]: record.text
                  });
                }
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

/*
InputTagComponent.propTypes = {
  store: PropTypes.oneOfType([PropTypes.array]),
  fields: PropTypes.oneOfType([PropTypes.array]),
  valueTag: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  displayField: PropTypes.string.isRequired,
  displayTag: PropTypes.string.isRequired,
  columns: PropTypes.object.isRequired
}
*/
//export const InputTag = InputTagComponent;