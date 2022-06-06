import express, { Request, Response } from "express";
import * as jwt from "./helper/jwtHelper";

function jwtHandler() {
  return async (req: Request, res: Response) => {
    if (
      req.path.match(/^\/v1\/users/) ||
      req.path.match(/^\/v1\/email/)
    ) {
      next()
    } else {
      const { authorization } = req.headers
      if (authorization) {
        try {
          const jwtToken = jwt.verify(authorization)
          req.body.userId = jwtToken
          next()
        } catch (e) {
          res.statusCode = 401
          return null
        }
      } else {
        return null
      }
    }
  }
}
module.exports = jwtHandler

function next() {
    throw new Error("Function not implemented.");
}
