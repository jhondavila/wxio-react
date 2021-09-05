import React from 'react';
import { Form, Row ,Col, Button } from "react-bootstrap";
import {
    ControlledMenu,
    MenuItem,
    useMenuState,
    MenuDivider
}
 from '@szhsin/react-menu';

 import typesFilters from "./TypesFilters";
 import {FBoolean,FDate,FInteger,FNumber,FString,FTime} from "./FTypes"
import * as _ from "lodash";
export class FilterCfg extends React.Component {
    constructor(opts) {
        super(opts);

        this.state = {
            conditionDisplay : "Ninguno",
            conditionValue : "none",
            
            valueCondition : "",
            valueMin : "",
            valueMax : "",

            types : typesFilters,
            listOptions : [
                
            ],
            checkedOptions : {

            },
            checkedAll : false
        }
        this.rangeEval = [
            typesFilters.between.key,
            typesFilters.notBetween.key,
        ];
        this.compareEval = [
            typesFilters.between.key,
            typesFilters.notBetween.key,
            typesFilters.greaterThan.key,
            typesFilters.greaterEqualTo.key,
            typesFilters.lessThan.key,
            typesFilters.lessEqualTo.key,
            typesFilters.equal.key,
            typesFilters.noEqual.key,
            typesFilters.between.key,
            typesFilters.notBetween.key,
        ]
    }

    componentDidUpdate(prevProps){

        console.log(prevProps)
        if(prevProps.value !== this.props.value){
                console.log(this.props.value)
        }
        if(prevProps.field !== this.props.field){
            this.refreshListOptions();
        }
        if(prevProps.value !== this.props.value){
            this.initFilter()
        }
    }
    initFilter(){
        console.log("initFilter")
        if(this.props.value && !this.props.value.type){
            this.setState({
                checkedAll : true
            })
        }else if(this.props.value && this.props.value.type == "where_in"){
            // debugger
            let value= this.props.value.value;
             
            this.setState({
                checkedOptions : {
                    ...value.reduce((obj, item) => {
                        return {
                            ...obj,
                            [item]: true,
                        };
                    }, {})
                }
            })
        }
    }
    refreshListOptions(){
        console.log("refreshListOptions");
        let data = this.props.store ? this.props.store.getData() : this.props.data;

        let list = _.chain(data).uniqBy(this.props.property).map((i,key)=>{
                return {
                    value : i[this.props.property],
                    text : i[this.props.property]
                }
            }).sortBy(["value"],["asc"]).value()

        this.setState({
            listOptions : list
        })
    }
    onSelectType(e){
        console.log(e)
        this.setState({
            conditionDisplay : this.state.types[e.value].text,
            conditionValue :this.state.types[e.value].key
        });
    }
    changeFilter(){
    }
    
    render() {
        let { types }  = this.state;
        let field = this.props.field;
        let fieldType = field ? field.type : "string";
        return (
            <div className="chooser-filter-condition">
                <Col className="filter-condition">
                    <Row>
                        Filtrar por Condición
                    
                    </Row>
                    <Row>

                    <Form.Control type="text" value={this.state.conditionDisplay} readOnly={true} onClick={e=>this.setState({
                        showMenuCondition: true,
                        menuConditionsAP: { x: e.clientX, y: e.clientY }
                    })}/>
                    </Row>

                    {
                        this.renderType()
                    }
                    
                <ControlledMenu anchorPoint={this.state.menuConditionsAP} isOpen={this.state.showMenuCondition}
                        onClose={() => {
                            this.setState({
                                showMenuCondition: false
                            })
                        }}>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.none.key}>{types.none.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.cellEmpty.key}>{types.cellEmpty.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.cellNotEmpty.key}>{types.cellNotEmpty.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.contains.key}>{types.contains.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.notContains.key}>{types.notContains.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.textBeginsWith.key}>{types.textBeginsWith.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.textEndWidth.key}>{types.textEndWidth.text}</MenuItem>
                        <MenuItem onClick={this.onSelectType.bind(this)} value={types.textExact.key}>{types.textExact.text}</MenuItem>
                        
                        
                      
                        {
                            this.compareEval.includes(fieldType) && 
                            <>
                                <MenuDivider></MenuDivider>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.greaterThan.key}>{types.greaterThan.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.greaterEqualTo.key}>{types.greaterEqualTo.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.lessThan.key}>{types.lessThan.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.lessEqualTo.key}>{types.lessEqualTo.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.equal.key}>{types.equal.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.noEqual.key}>{types.noEqual.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.between.key}>{types.between.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.notBetween.key}>{types.notBetween.text}</MenuItem>
                            </>
                        }

                        {
                            this.rangeEval.includes(fieldType) &&
                            <>
                                <MenuDivider></MenuDivider>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.dateIs.key}>{types.dateIs.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.dateBefore.key}>{types.dateBefore.text}</MenuItem>
                                <MenuItem onClick={this.onSelectType.bind(this)} value={types.dateAfter.key}>{types.dateAfter.text}</MenuItem>
                            </>
                        }

                        

                    </ControlledMenu>

                </Col>

                <Col className="filter-values">
                    <Row>
                        Filtrar por Valores
                    </Row>
                    <Row className="fast-option">
                        <span className="cursor-pointer text-clickeable" onClick={this.onSelectAll.bind(this)}>Selectionar Todo</span>
                        <span className="mx-2">-</span>
                        <span className="cursor-pointer text-clickeable" onClick={this.onDeselectAll.bind(this)}>Borrar</span>
                    </Row>
                    <Row>
                        
                    <Form.Control type="text" placeholder={"Buscar"} value={this.state.textContains} onChange={e=>this.setState({textContains : e.target.value})} />
                    </Row>

                    <Row className="filter-options flex-column py-2">
                        <Col className="mx-0 px-0 d-flex list-filter">
                            <div className="border flex-fill overflow-auto p-2 ">
                            {
                            this.state.listOptions.map((item,idx)=>{
                                return(
                                <Form.Check  
                                    type={"checkbox"}
                                    key={`${item.value}-${idx}`}
                                    label={item.text || item }
                                    checked={this.state.checkedOptions[item.value] || this.state.checkedAll}
                                    onChange={e=>{

                                        if(this.state.checkedAll){
                                            let obj = {
                                            };
                                            this.state.listOptions.forEach(i=>{
                                                obj[i.value] = true
                                            });
                                            delete obj[item.value];
                                            this.setState({
                                                checkedAll : false,
                                                checkedOptions :obj
                                            })
                                        }else{
                                        
                                            if(e.target.checked){
                                                let obj = {
                                                    ...this.state.checkedOptions,
                                                    [item.value] :  e.target.checked
                                                };
                                                console.log(Object.keys(obj).length,this.state.listOptions.length)
                                                if(Object.keys(obj).length == this.state.listOptions.length){
                                                    console.log("xxx")
                                                    this.setState({
                                                        checkedAll : true,
                                                        checkedOptions :{

                                                        }
                                                    })
                                                }else{

                                                    this.setState({
                                                        checkedOptions :obj
                                                    })
                                                }
                                                // if()
                                                
                                            }else{
                                                delete this.state.checkedOptions[item.value];
                                                this.setState({
                                                    checkedOptions :{
                                                        ...this.state.checkedOptions
                                                    }
                                                })
                                            }
                                            // if(this.state.checkedOptions.hasOwnProperty(item.value)){


                                            // }
                                       
                                        }
                                        
                                    }}
                                />
                                )

                            })
                        }
                            </div>
                        
                        </Col>
                        
                        
                    </Row>

                </Col>
                        <Col className={"text-right px-0"}>
                            <Button variant="secondary" className="mr-2" onClick={this.props.onCancel}>
                                Cancelar
                            </Button>
                            <Button onClick={this.createFilter.bind(this)}>
                                Confirmar
                            </Button>
                        </Col>
            </div>
        );
    }
    onSelectAll(){
        console.log("onSelectAll")
        this.setState({
            checkedAll : true
        });
    }
    onDeselectAll(){
        console.log("onDeselectAll")
        this.setState({
            checkedAll : false
        });
    }
    createFilter(){
        let filter;
        // debugger
        if(this.state.conditionValue == "none"){
            filter = {
                ...(!this.state.checkedAll && {
                    property : this.props.property,
                    type : "where_in",
                    value : this.state.listOptions.filter(i=>{

                        return this.state.checkedOptions[i.value]
                    }).map(i=>i.value)
                })
            };
        }else if(this.inputField){
             filter = this.inputField.getFilter();
        }else{

        }
        
        this.props.onConfirm({
            property : this.props.property,
            config : filter
        });
    }
    renderType(){
        let { types } = this.state;
        let field = this.props.field;
        let fieldType = field ? field.type : "string";

        if(fieldType == "string"){
            return (
                <FString ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else if(fieldType == "boolean"){
            return (
                <FBoolean ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else if(fieldType == "date"){
            return (
                <FDate ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else if(fieldType == "integer"){
            return (
                <FInteger ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else if(fieldType == "number"){
            return (
                <FNumber ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else if(fieldType == "time"){
            return (
                <FTime ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }else{
            return (
                <FString ref={c=>this.inputField} condition={this.state.conditionValue}/>
            )
        }

    }
};
