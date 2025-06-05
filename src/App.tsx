import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider, SignIn, SignUp} from "./features/auth";
import {Home} from "./pages/home/Home";
import {ItemContainer} from "./components/item/ItemContainer";
import {RoleBasedRoute} from './features/routes';
import {Role} from './types/SignUpIF';
import {ItemForm} from "./components/item/ItemForm";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home/>}>

                        <Route path='items/:itemTableState' element={<ItemContainer/>}/>
                        <Route path='items/add-items' element={<ItemForm/>}/>
                        <Route path='items/edit-item/:editItem' element={<ItemForm/>}/>

                    </Route>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
