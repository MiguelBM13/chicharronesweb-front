// Paquete: com.chicharronesweb.pedidosapi.dto
package com.chicharronesweb.pedidosapi.dto;

import lombok.Data;
import java.util.List;

@Data
public class PedidoRequestDTO {
    private List<DetallePedidoRequestDTO> detalles;

	public List<DetallePedidoRequestDTO> getDetalles() {
		return detalles;
	}

	public void setDetalles(List<DetallePedidoRequestDTO> detalles) {
		this.detalles = detalles;
	}
}