import android.graphics.Color
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.myapplication.MainActivity
import com.example.myapplication.R

class YarismaciAdapter(
    private val yarismacilar: List<MainActivity.Yarismaci>,
    private val onYarismaciClick: (MainActivity.Yarismaci) -> Unit
) : RecyclerView.Adapter<YarismaciAdapter.YarismaciViewHolder>() {

    private var secimHakki = 2

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): YarismaciViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.yarismaci_item, parent, false)
        return YarismaciViewHolder(view)
    }

    override fun onBindViewHolder(holder: YarismaciViewHolder, position: Int) {
        val yarismaci = yarismacilar[position]
        holder.itemView.setBackgroundColor(Color.WHITE)

        holder.bind(yarismaci) { isKazanan ->
            if (secimHakki > 0) {
                secimHakki--
                if (isKazanan) {
                    holder.itemView.setBackgroundColor(Color.GREEN)
                } else {
                    holder.itemView.setBackgroundColor(Color.RED)
                }
                onYarismaciClick(yarismaci)
            } else {
                onYarismaciClick(yarismaci)
            }
        }
    }

    fun sifirlaSecimHakki() {
        secimHakki = 2
        Log.d("Adapter", "Secim hakkı sıfırlandı.")
    }

    override fun getItemCount(): Int = yarismacilar.size

    class YarismaciViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val isimTextView: TextView = itemView.findViewById(R.id.yarismaciIsim)
        private val bilgiTextView: TextView = itemView.findViewById(R.id.yarismaciBilgi)

        fun bind(
            yarismaci: MainActivity.Yarismaci,
            onSecimYapildi: (Boolean) -> Unit
        ) {
            isimTextView.text = yarismaci.isim
            bilgiTextView.text = "Arama: ${yarismaci.aramaSayisi}, Mesaj: ${yarismaci.mesajSayisi}"
            itemView.setOnClickListener {
                onSecimYapildi(yarismaci.kazananMi)
            }
        }
    }
}
