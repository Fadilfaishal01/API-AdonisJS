import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MUser from 'App/Models/MUser'
import MNote from 'App/Models/MasterData/MNote'

export default class NotesController {
  public async index ({response, auth}: HttpContextContract) {
    const dataNotes = await MNote.findBy('user_id', auth.user?.id)

    return response.json({
      code: 200,
      message: 'Success',
      data: dataNotes,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store ({request, response, auth}: HttpContextContract) {
    const { title, content } = request.body()

    const getDataUser = await MUser.query().where({email: auth.user?.email}).first()

    if(!getDataUser) {
      return response.status(404).json({
        code: 404,
        message: 'User not found',
      })
    }

    await MNote.create({
      user_id: getDataUser.id,
      title: title,
      content: content,
    })

    response.json({
      code: 200,
      message: 'Successfully Add Notes',
    })
  }

  public async show ({ params, response, auth }: HttpContextContract) {
    const { id } = params
    const dataNotes = await MNote.query()
      .where({id: id})
      .where({user_id: auth.user?.id})
      .firstOrFail()

    return response.json({
      code: 200,
      message: 'Successfully get data notes',
      data: dataNotes,
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update ({params, response, request, auth}: HttpContextContract) {
    const { id } = params
    const { title, content } = request.body()

    try {
      // Typing Update Data 1
      const dataNotes = await MNote.query()
        .where({id: id})
        .where({user_id: auth.user?.id})
        .firstOrFail()

      dataNotes.title = title
      dataNotes.content = content
      dataNotes.save()

      // Typing update data 2
      // dataNotes.merge({
      //   title: title,
      //   content: content,
      // })

      // Typing update data 3
      // await MNote.query()
      //   .where({id : id})
      //   .update({
      //     title: title,
      //     content: content,
      // })

      return response.json({
        code: 200,
        message: 'Successfully update data notes',
        data: dataNotes,
      })
    } catch (error) {
      return response.json({
        code: 500,
        message: error.message,
      })
    }
  }

  public async destroy ({params, response}: HttpContextContract) {
    const { id } = params

    try {
      const dataNotes = await MNote.query()
        .where({id: id})
        .firstOrFail()

      // Delete data
      await dataNotes.delete()

      return response.json({
        code: 200,
        message: 'Successfully delete data notes',
      })
    } catch (error) {
      return response.json({
        code: 500,
        message: error.message,
      })
    }
  }
}
