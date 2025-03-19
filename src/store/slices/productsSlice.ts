import { createSlice } from "@reduxjs/toolkit"

export interface Total {
  pageIndex: number
  pageSize: number
  totalPage: number
  totalProduct: number
}
interface ProductSlice {
  totalProduct: Total
  isLoading: boolean
  dataProduct: any[]
  search: string
  count: number
}
const initialState: ProductSlice = {
  search: "",
  totalProduct: { pageIndex: 1, pageSize: 8, totalPage: 1, totalProduct: 0 },
  isLoading: true,
  dataProduct: [],
  count: 0,
}
const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setSearch: (state: any, action) => {
      state.search = action.payload
    },
    setTotal: (state: any, action) => {
      state.totalProduct = action.payload
    },
    setLoading: (state: any, action) => {
      state.isLoading = action.payload
    },
    setDataProduct: (state: any, action) => {
      state.dataProduct = action.payload
    },
    setCount: (state: any, action) => {
      state.count = action.payload
    },
  },
})
export const { setTotal, setLoading, setDataProduct, setSearch, setCount } =
  productSlice.actions
export default productSlice.reducer
