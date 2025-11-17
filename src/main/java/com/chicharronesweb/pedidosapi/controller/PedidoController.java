package com.chicharronesweb.pedidosapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chicharronesweb.pedidosapi.dto.PedidoRequestDTO;
import com.chicharronesweb.pedidosapi.entity.Pedido;
import com.chicharronesweb.pedidosapi.repository.PedidoRepository;
import com.chicharronesweb.pedidosapi.service.PedidoService;
import com.chicharronesweb.pedidosapi.service.NotificacionService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private NotificacionService notificacionService;


    @Autowired
    private PedidoRepository pedidoRepository;

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoRequestDTO pedidoRequest) {
        Integer usuarioIdSimulado = 1; // ⚠️ temporal
        Pedido nuevoPedido = pedidoService.crearPedido(pedidoRequest, usuarioIdSimulado);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodosLosPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAllOrderByFechaAndEntregadoLast();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Integer id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstadoPedido(
            @PathVariable Integer id,
            @RequestParam("estado") Pedido.EstadoPedido nuevoEstado) {

        return pedidoRepository.findById(id)
                .map(pedido -> {
                    pedido.setEstado(nuevoEstado);
                    Pedido pedidoActualizado = pedidoRepository.save(pedido);
                    return ResponseEntity.ok(pedidoActualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPedidosPorUsuario(@PathVariable Integer usuarioId) {
        return pedidoService.obtenerPedidosPorUsuario(usuarioId);
    }
}