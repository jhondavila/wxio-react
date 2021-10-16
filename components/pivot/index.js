// import PivotTable from "./Table"
import ContainerDnD from "./choosefield/ContainerDnD"
import Pivot from "./PivotGrid"
import { connectToStore } from "../../store/StoreConnect"

const PivotGrid = connectToStore(Pivot)
export {
    // PivotTable,
    ContainerDnD,
    PivotGrid
}