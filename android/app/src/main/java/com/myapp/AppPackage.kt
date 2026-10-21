package com.myapp

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class AppPackage : BaseReactPackage() {
    override fun getModule(name: String, ctx: ReactApplicationContext): NativeModule? =
        if (name == SimInfoModule.NAME) SimInfoModule(ctx) else null

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            SimInfoModule.NAME to ReactModuleInfo(
                SimInfoModule.NAME, SimInfoModule.NAME,
                false, false, false, true
            )
        )
    }
}