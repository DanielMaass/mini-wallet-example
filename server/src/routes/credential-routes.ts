import { Router } from "express"
import {
  createCredential,
  deleteCredential,
  getCredentialById,
  getCredentials,
  verifyCredential,
} from "../controllers/credentials-controller.js"

const router = Router()

/**
 * @openapi
 * /credentials:
 *   get:
 *     summary: Liste aller Credentials
 *     tags:
 *       - Credentials
 *     responses:
 *       200:
 *         description: Erfolgreich
 */
router.get("/credentials", getCredentials)

/**
 * @openapi
 * /credentials/{id}:
 *   get:
 *     summary: Details eines Credentials
 *     tags:
 *       - Credentials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID des Credentials
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreich
 */
router.get("/credentials/:id", getCredentialById)

/**
 * @openapi
 * /credentials:
 *   post:
 *     summary: Erstelle ein neues Credential
 *     tags:
 *       - Credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *               claims:
 *                 type: object
 *               subject:
 *                 type: string
 *             example:
 *               type: ["VerifiableCredential", "AlumniCredential"]
 *               claims:
 *                 name: "John Doe"
 *                 age: 30
 *               subject: "did:example:self"
 *     responses:
 *       201:
 *         description: Credential erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: array
 *                   items:
 *                     type: string
 *                 claims:
 *                   type: object
 *                 subject:
 *                   type: string
 *               example:
 *                 id: "12345"
 *                 type: ["VerifiableCredential", "AlumniCredential"]
 *                 claims:
 *                   name: "John Doe"
 *                   age: 30
 *                 subject: "did:example:self"
 */
router.post("/credentials", createCredential)

/**
 * @openapi
 * /credentials/{id}:
 *   delete:
 *     summary: Lösche ein Credential
 *     tags:
 *       - Credentials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Die ID des Credentials
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Credential gelöscht
 */
router.delete("/credentials/:id", deleteCredential)

/**
 * @openapi
 * /credentials/verify:
 *  post:
 *    summary: Verify a verifiable credential
 *    tags:
 *      - Credentials
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            oneOf:
 *              - properties:
 *                jws:
 *                  type: string
 *                  description: A JSON Web Signature (JWS) to verify
 *              - properties:
 *                credential:
 *                  type: object
 *                  description: A verifiable credential to verify
 *          example:
 *            jws: "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpleGFtcGxlOnNlbGYjZGVtb0tleSJ9..eyJpZCI6IjEyMzQ1IiwiaXNzdWVyIjp7ImlkIjoiZGlkOmV4YW1wbGU6c2VsZiIsImtpZCI6ImRpZDpleGFtcGxlOnNlbGYjZGVtb0tleSJ9LCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQWx1bW5pQ3JlZGVudGlhbCJdLCJzdWJqZWN0IjoiZGlkOmV4YW1wbGU6c2VsZiIsImlzc3"
 *            credential:
 *              id: "12345"
 *              issuedAt: "2023-10-11T12:34:20Z"
 *              issuer: "did:example:issuer-id"
 *              subject: "did:example:self"
 *              type: ["VerifiableCredential", "AlumniCredential"]
 *              credentialSubject:
 *                name: "John Doe"
 *                age: 30
 *              proof:
 *                type: "Ed25519Signature2018"
 *                jws: "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpleGFtcGxlOnNlbGYjZGVtb0tleSJ9..eyJpZCI6IjEyMzQ1IiwiaXNzdWVyIjp7ImlkIjoiZGlkOmV4YW1wbGU6c2VsZiIsImtpZCI6ImRpZDpleGFtcGxlOnNlbGYjZGVtb0tleSJ9LCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQWx1bW5pQ3JlZGVudGlhbCJdLCJzdWJqZWN0IjoiZGlkOmV4YW1wbGU6c2VsZiIsImlzc3VlZEF0IjoiMjAyMy0xMC0xMVQxMjozNDoyMFoiLCJjbGFpbXMiOnsibmFtZSI6IkpvaG4gRG9lIiwiYWdlIjozMH19fQ.YWJjMTIz"
 *    responses:
 *      200:
 *        description: Verification result
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                valid:
 *                  type: boolean
 *                  description: Indicates if the credential is valid
 *                error:
 *                  type: string
 *                  description: Error message if the credential is invalid
 *                header:
 *                  type: object
 *                  description: The protected header of the JWS
 *                payload:
 *                  type: object
 *                  description: The decoded payload of the JWS
 * */
router.post("/credentials/verify", verifyCredential)

export default router
