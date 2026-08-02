import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import type { AuthenticatedRequest, TokenPayload } from '../middlewares/auth.middleware.js';

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Credenciais inválidas.' });
        return;
      }

      const initialEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@musicasmissa.com').toLowerCase().trim();
      if (user.email === initialEmail && user.status !== 'approved') {
        user.status = 'approved';
        await user.save();
      }

      if (user.status === 'pending') {
        res.status(403).json({ error: 'Seu cadastro ainda está pendente de aprovação por um administrador.' });
        return;
      }

      if (user.status === 'rejected') {
        res.status(403).json({ error: 'Seu cadastro foi recusado por um administrador.' });
        return;
      }

      const secret = process.env.JWT_SECRET || 'musicas-missa-dev-jwt-secret';
      const payload: TokenPayload = {
        userId: String(user._id),
        email: user.email,
        role: user.role,
        nome: user.nome,
      };

      const token = jwt.sign(payload, secret, { expiresIn: '7d' });

      res.status(200).json({
        token,
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error: any) {
      console.error('[backend][auth] login error', error);
      res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        nome: nome.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
        status: 'pending',
      });

      res.status(201).json({
        message: 'Solicitação de cadastro enviada com sucesso! Aguarde a aprovação de um administrador.',
        user: {
          id: newUser._id,
          nome: newUser.nome,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
      });
    } catch (error: any) {
      console.error('[backend][auth] register error', error);
      res.status(500).json({ error: 'Erro ao solicitar cadastro', details: error.message });
    }
  }

  async getPendingUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await User.find({ status: 'pending' })
        .select('-passwordHash')
        .sort({ createdAt: -1 });

      res.status(200).json(users);
    } catch (error: any) {
      console.error('[backend][auth] getPendingUsers error', error);
      res.status(500).json({ error: 'Erro ao buscar solicitações pendentes', details: error.message });
    }
  }

  async approveUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
      ).select('-passwordHash');

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json({ message: 'Usuário aprovado com sucesso.', user });
    } catch (error: any) {
      console.error('[backend][auth] approveUser error', error);
      res.status(500).json({ error: 'Erro ao aprovar usuário', details: error.message });
    }
  }

  async rejectUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'rejected' },
        { new: true }
      ).select('-passwordHash');

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json({ message: 'Usuário recusado com sucesso.', user });
    } catch (error: any) {
      console.error('[backend][auth] rejectUser error', error);
      res.status(500).json({ error: 'Erro ao recusar usuário', details: error.message });
    }
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado.' });
        return;
      }

      const user = await User.findById(req.user.userId).select('-passwordHash');

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      console.error('[backend][auth] me error', error);
      res.status(500).json({ error: 'Erro ao buscar dados do perfil', details: error.message });
    }
  }

  async bootstrapInitialAdmin(): Promise<void> {
    try {
      // 1. Auto-migrar todos os usuários existentes no banco sem o campo status definido para 'approved'
      await User.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'approved' } }
      );

      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@musicasmissa.com';
        const password = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123456';
        const nome = process.env.INITIAL_ADMIN_NAME || 'Administrador Inicial';

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.create({
          nome,
          email: email.toLowerCase().trim(),
          passwordHash,
          role: 'admin',
          status: 'approved',
        });

        console.log(`[backend][auth] Admin inicial criado com sucesso: ${email}`);
      } else {
        // Garantir que o admin inicial padrão esteja aprovado caso tenha sido criado anteriormente
        const initialEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@musicasmissa.com').toLowerCase().trim();
        await User.updateOne({ email: initialEmail }, { $set: { status: 'approved' } });
      }
    } catch (error) {
      console.error('[backend][auth] Erro ao criar/atualizar admin inicial:', error);
    }
  }
}

export default new AuthController();
