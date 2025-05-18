import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./features/auth/AuthProvider";
import {SignIn} from "./pages/auth/SignIn";
import {SignUp} from "./pages/auth/SignUp";
import {Home} from "./pages/home/Home";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home/>}>
                        <Route path='home' element={<Home/>}/>
                        //TODO
                    </Route>
                    <Route path='sign-in' element={<SignIn/>}/>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
