package com.example.myapplication

import YarismaciAdapter
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlin.random.Random

class MainActivity : AppCompatActivity() {

    data class Yarismaci(
        val isim: String,
        var aramaSayisi: Int = 0,
        var mesajSayisi: Int = 0,
        var toplamPuan: Int = 0,
        var kazananMi: Boolean = false
    )

    private val yarismacilar = mutableListOf(
        Yarismaci("Yıldız"),
        Yarismaci("Veysel"),
        Yarismaci("Elif"),
        Yarismaci("Ramazan"),
        Yarismaci("Can")
    )

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: YarismaciAdapter
    private var kazanan: Yarismaci? = null
    private var kalanDenemeHakki = 2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        recyclerView = findViewById(R.id.yarismaciRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = YarismaciAdapter(yarismacilar) { secilenYarismaci ->
            denemeYap(secilenYarismaci)
        }
        recyclerView.adapter = adapter

        // Oyunun başında bilgilendirme yapalım
        oyunHakkindaBilgiGoster()
    }

    private fun oyunHakkindaBilgiGoster() {
        val mesaj = """
            Oyunumuza hoş geldiniz!
            
            Bu bir matematik / tahmin oyunudur.
            Yarışmacılara gelen her "Arama" 2 puan, her "Mesaj" 1 puan değerindedir.
            
            Verilen arama ve mesaj sayılarına göre hangi yarışmacının en yüksek puana sahip olduğunu tahmin etmelisiniz.
            
            Toplam 2 tahmin hakkınız vardır.
            
            "Tamam" butonuna bastığınızda oyun başlayacaktır. Başarılar!
        """.trimIndent()

        val builder = AlertDialog.Builder(this)
        builder.setTitle("Bilgilendirme")
        builder.setMessage(mesaj)
        builder.setCancelable(false)
        builder.setPositiveButton("Tamam") { dialog, _ ->
            dialog.dismiss()
            yeniOyunBaslat()
        }
        builder.create().show()
    }

    private fun yeniOyunBaslat() {
        Log.d("Oyun", "Yeni oyun başlatılıyor")

        yarismacilar.clear()
        yarismacilar.addAll(
            listOf(
                Yarismaci("Yıldız"),
                Yarismaci("Veysel"),
                Yarismaci("Elif"),
                Yarismaci("Ramazan"),
                Yarismaci("Can")
            )
        )

        yarismacilar.forEach {
            it.aramaSayisi = Random.nextInt(1, 50)
            it.mesajSayisi = Random.nextInt(1, 100)
            it.toplamPuan = it.aramaSayisi * 2 + it.mesajSayisi
            it.kazananMi = false
        }

        kazanan = yarismacilar.maxByOrNull { it.toplamPuan }?.apply {
            kazananMi = true
        }

        kalanDenemeHakki = 2
        adapter.sifirlaSecimHakki()
        adapter.notifyDataSetChanged()

        Log.d("Oyun", "Yeni oyun başladı - Kazanan: ${kazanan?.isim}")
        Toast.makeText(this, "Oyun başladı! Tahmin yapmaya başlayın.", Toast.LENGTH_SHORT).show()
    }

    private fun denemeYap(secilenYarismaci: Yarismaci) {
        if (secilenYarismaci.kazananMi) {
            Log.d("Oyun", "Doğru tahmin: ${secilenYarismaci.isim}")
            val builder = AlertDialog.Builder(this)
            builder.setTitle("Tebrikler!")
            builder.setMessage("Doğru tahmin ettiniz! Kazanan ${secilenYarismaci.isim}.")
            builder.setCancelable(false)
            builder.setPositiveButton("Tamam") { dialog, _ ->
                yeniOyunBaslat()
                dialog.dismiss()
            }
            builder.create().show()
        } else {
            Log.d("Oyun", "Yanlış tahmin: ${secilenYarismaci.isim}")
            kalanDenemeHakki--
            if (kalanDenemeHakki > 0) {
                Toast.makeText(
                    this,
                    "Yanlış tahmin! Kalan deneme hakkınız: $kalanDenemeHakki",
                    Toast.LENGTH_SHORT
                ).show()
            } else {
                Log.d("Oyun", "Deneme hakkı bitti")
                val builder = AlertDialog.Builder(this)
                builder.setTitle("Oyun Bitti!")
                builder.setMessage("Deneme hakkınız bitti! Kazanan ${kazanan?.isim}. Yeni oyun başlıyor...")
                builder.setCancelable(false)
                builder.setPositiveButton("Tamam") { dialog, _ ->
                    yeniOyunBaslat()
                    dialog.dismiss()
                }
                builder.create().show()
            }
        }
    }
}
