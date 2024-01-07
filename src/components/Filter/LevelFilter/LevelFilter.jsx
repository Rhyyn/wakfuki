import React, { useState } from "react";
import cssModule from "./LevelFilter.module.scss";
import { Slider } from "@radix-ui/themes";


const LevelFilter = () => {


    return (
        <div>
            <h2>Level Filter</h2>
            <Slider defaultValue={[0, 230]} />
        </div>
    );
};

export default LevelFilter;
