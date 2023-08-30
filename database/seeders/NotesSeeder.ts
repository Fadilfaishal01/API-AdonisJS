import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MNote from 'App/Models/MasterData/MNote'

export default class extends BaseSeeder {
  public async run () {
    // Untuk menghapus semua data yang ada di table notes
    await MNote.query().delete()

    var dataNotes = [
      {
        title: 'Pengumuman buat besok',
        content: 'Besok bawa bekal dari rumah',
      },
      {
        title: 'Pengumuman buat tanggal 23 September 2023',
        content: 'Ada acara makan bersama dengan teman alumni SMKN 1 Ciomas',
      },
    ]

    for (let index = 0; index < dataNotes.length; index++) {
      await MNote.create({
        title: dataNotes[index].title,
        content: dataNotes[index].content,
      })
    }
  }
}
