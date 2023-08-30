import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MUser from 'App/Models/MUser'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async register ({request, response, auth} : HttpContextContract) {
    const { email, password } = request.body()

    try {
      const cekEmail = await MUser.query().where({email: email}).first()
      if (cekEmail) {
        return response.status(422).json({
          code: 422,
          message: 'Email already exist!',
        })
      }

      const hashedPassword = await Hash.make(password)

      const user = await MUser.create({
        email: email,
        password: hashedPassword,
      })

      const token = await auth.use('api').generate(user)

      return response.status(201).json({
        code: 201,
        message: 'Successfully register user',
        data: {
          user: user,
          token: token,
        },
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: error.message,
      })
    }
  }

  public async login ({request, response, auth} : HttpContextContract) {
    const { email, password } = request.body()

    try {
      // get user by email
      const user = await MUser.query().where({email: email}).first()

      // Cek data user by email
      if (!user) {
        return response.status(422).json({
          code: 422,
          message: 'Email not found!',
        })
      }

      // Verify password
      if (!await Hash.verify(user.password, password)) {
        return response.status(422).json({
          code: 422,
          message: 'Your password is incorrect',
        })
      }

      const token = await auth.use('api').generate(user)

      return response.status(201).json({
        code: 201,
        message: 'Successfully login user',
        data: {
          user: user,
          token: token,
        },
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: error.message,
      })
    }
  }
}
