package com.myapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.SubscriptionManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.myapp.specs.NativeSimInfoSpec

class SimInfoModule(ctx: ReactApplicationContext) : NativeSimInfoSpec(ctx) {
    override fun getName() = NAME

    override fun getSimInfo(promise: Promise) {
        val ctx = reactApplicationContext
        val granted = ContextCompat.checkSelfPermission(
            ctx, Manifest.permission.READ_PHONE_STATE
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) {
            promise.reject("E_NO_PERMISSION", "READ_PHONE_STATE not granted")
            return
        }
        try {
            val sm = ctx.getSystemService(SubscriptionManager::class.java)
            val subs = sm.activeSubscriptionInfoList ?: emptyList()
            val result = Arguments.createArray()
            for (s in subs) {
                val map = Arguments.createMap()
                map.putInt("slot", s.simSlotIndex)
                map.putString("carrier", s.carrierName?.toString() ?: "")
                map.putString("displayName", s.displayName?.toString() ?: "")
                map.putString("countryIso", s.countryIso ?: "")
                map.putString("number", readNumber(sm, s.subscriptionId, s.number))
                result.pushMap(map)
            }
            promise.resolve(result)
        } catch (e: SecurityException) {
            promise.reject("E_SECURITY", e)
        } catch (e: Exception) {
            promise.reject("E_SIM_INFO", e)
        }
    }

    private fun readNumber(sm: SubscriptionManager, subId: Int, legacy: String?): String {
        return try {
            if (Build.VERSION.SDK_INT >= 33) sm.getPhoneNumber(subId) else legacy ?: ""
        } catch (e: Exception) {
            legacy ?: ""
        }
    }

    companion object { const val NAME = "NativeSimInfo" }
}