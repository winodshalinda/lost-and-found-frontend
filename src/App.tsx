import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider, SignIn, SignUp} from "./features/auth";
import {Home} from "./pages/home/Home";
import {ItemContainer} from "./components/item/ItemContainer";
import {RoleBasedRoute} from './features/routes';
import {Role} from './types/SignUpIF';
import ForbiddenPage from './pages/ForbiddenPage';
import {ItemForm} from "./components/item/ItemForm";
import {RequestTable} from "./components/request/RequestTable";
import {UserTable} from "./components/user/UserTable";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home/>}>

                        <Route path='items/:itemTableState' element={<ItemContainer/>}/>
                        <Route path='items/add-items' element={<ItemForm/>}/>
                        <Route path='items/edit-item/:editItem' element={<ItemForm/>}/>

                        <Route path='requests/:requestTableState' element={<RequestTable/>}/>

                        <Route
                            path='all-users'
                            element={<RoleBasedRoute allowedRoles={[Role.ADMIN]}/>}
                        >
                            <Route index element={<UserTable/>}/>
                        </Route>

                    </Route>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                    <Route path='/forbidden' element={<ForbiddenPage/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
